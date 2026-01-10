import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { LoginDto, RegisterDto } from "./dto/create-auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../auth/entities/auth.entity";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { OtpType } from "./otp/otp.entity";
import { OtpService } from "./otp/otp.service";
import { MailService } from "./mail/mail.servics";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService
  ) {}

  ///// REGISTER
  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = this.userRepo.create({
      email: registerDto.email,
      password: hashedPassword,
      isEmailVerified: false,
    });

    await this.userRepo.save(newUser);

    const otp = await this.otpService.createOtp(
      newUser.id,
      OtpType.EMAIL_VERIFY
    );

    await this.mailService.sendOtp(newUser.email, otp);

    return {
      message: "OTP sent to your email",
    };
  }

  ///// VERIFY
  async verifyEmail(email: string, otp: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or OTP");
    }

    await this.otpService.verifyOtp(user.id, otp, OtpType.EMAIL_VERIFY);

    user.isEmailVerified = true;
    await this.userRepo.save(user);

    return this.generateToken(user);
  }

  ///// LOGIN
  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const checkPass = await bcrypt.compare(loginDto.password, user.password);

    if (!checkPass) throw new UnauthorizedException("Invalid credentials");
    if (!user.isEmailVerified) {
      throw new UnauthorizedException("Please verify your email");
    }

    return this.generateToken(user);
  }

  ///// REFRESHTOKEN
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException("Access denied");
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException("Access denied");
    }

    return this.generateToken(user);
  }

  ///// TOKEN
  private async generateToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "15m",
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: "7d" }
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userRepo.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  ///// LOGOUT
  async logout(userId: number) {
    await this.userRepo.update(userId, {
      refreshToken: null,
    });

    return { message: "Logged out successfully" };
  }


  
///// FORGOT PASSWORD
async forgotPassword(email: string) {
  const user = await this.userRepo.findOne({
    where: { email },
  });

  // Security: user bor-yo‘qligini aytmaymiz
  if (!user) {
    return { message: 'If email exists, OTP has been sent' };
  }

  const otp = await this.otpService.createOtp(
    user.id,
    OtpType.FORGOT_PASSWORD,
  );

  await this.mailService.sendOtp(user.email, otp);

  return { message: 'OTP sent to your email' };
}

///// RESET PASSWORD
async resetPassword(
  email: string,
  otp: string,
  newPassword: string,
) {
  const user = await this.userRepo.findOne({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid request');
  }

  await this.otpService.verifyOtp(
    user.id,
    otp,
    OtpType.FORGOT_PASSWORD,
  );

  user.password = await bcrypt.hash(newPassword, 10);
  user.refreshToken = null; // barcha session’lar chiqadi

  await this.userRepo.save(user);

  return { message: 'Password successfully reset' };
}

///// CHANGE PASSWORD
async changePassword(
  userId: number,
  otp: string,
  newPassword: string,
) {
  const user = await this.userRepo.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedException('Access denied');
  }

  await this.otpService.verifyOtp(
    user.id,
    otp,
    OtpType.CHANGE_PASSWORD,
  );

  user.password = await bcrypt.hash(newPassword, 10);
  user.refreshToken = null;

  await this.userRepo.save(user);

  return { message: 'Password changed successfully' };
}
}

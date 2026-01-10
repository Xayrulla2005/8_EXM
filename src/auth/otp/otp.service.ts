import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Otp, OtpType } from './otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
  ) {}

  // OTP yaratish
  async createOtp(userId: number, type: OtpType) {
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 daqiqa

    await this.otpRepo.delete({ userId, type });

    const otpEntity = this.otpRepo.create({
      userId,
      otpHash,
      type,
      expiresAt,
    });

    await this.otpRepo.save(otpEntity);

    return otp; 
  }

  //  OTP tekshirish
  async verifyOtp(
    userId: number,
    otp: string,
    type: OtpType,
  ) {
    const record = await this.otpRepo.findOne({
      where: { userId, type },
      order: { createdAt: 'DESC' },
    });

    if (!record) {
      throw new UnauthorizedException('OTP not found');
    }

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException('OTP expired');
    }

    const isValid = await bcrypt.compare(
      otp,
      record.otpHash,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    await this.otpRepo.delete(record.id);

    return true;
  }
}

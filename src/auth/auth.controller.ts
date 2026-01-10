import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // REGISTER
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // LOGIN
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // REFRESH TOKEN
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({
    schema: {
      example: {
        userId: 1,
        refreshToken: 'refresh_token_here',
      },
    },
  })
  refresh(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refreshTokens(
      body.userId,
      body.refreshToken,
    );
  }

  // LOGOUT
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  logout(@Req() req) {
    return this.authService.logout(req.user.sub);
  }

  // FORGOT PASSWORD
  @Post('forgot-password')
  @ApiOperation({ summary: 'Send OTP for password reset' })
  @ApiBody({
    schema: {
      example: { email: 'test@gmail.com' },
    },
  })
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // RESET PASSWORD
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiBody({
    schema: {
      example: {
        email: 'test@gmail.com',
        otp: '123456',
        newPassword: 'newpass123',
      },
    },
  })
  resetPassword(@Body() body: {
    email: string;
    otp: string;
    newPassword: string;
  }) {
    return this.authService.resetPassword(
      body.email,
      body.otp,
      body.newPassword,
    );
  }

  // CHANGE PASSWORD
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('change-password')
  @ApiOperation({ summary: 'Change password (authorized)' })
  @ApiBody({
    schema: {
      example: {
        otp: '123456',
        newPassword: 'newpass123',
      },
    },
  })
  changePassword(
    @Req() req,
    @Body() body: { otp: string; newPassword: string },
  ) {
    return this.authService.changePassword(
      req.user.sub,
      body.otp,
      body.newPassword,
    );
  }
}

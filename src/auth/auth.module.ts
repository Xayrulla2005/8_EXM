import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User } from './entities/auth.entity';
import { JwtStrategy } from './jwt.strategy'
import { OtpService } from './otp/otp.service';
import { MailService } from './mail/mail.servics';
import { Otp } from './otp/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Otp]),

    PassportModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpService,
    MailService,
    JwtStrategy, 
  ],
  exports: [
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}

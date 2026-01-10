import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false, // 587 uchun false
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendOtp(email: string, otp: string) {
    try {
      await this.transporter.sendMail({
        from: `"Auth Service" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Your OTP code',
        html: `
          <h2>Email Verification</h2>
          <p>Your OTP code:</p>
          <h1>${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        `,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to send email',
      );
    }
  }
}

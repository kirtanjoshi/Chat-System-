/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // or another provider like Outlook, Yahoo
    auth: {
      user: 'kirtikirtanj@gmail.com', // ⚠️ Your email address
      pass: 'sprh vfko mpge adrx',    // ⚠️ App password, NOT your main email password
    },
  });

  async sendResetPasswordEmail(email: string, resetToken: string): Promise<void> {
    const resetLink = `http://localhost:3002/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: 'kirtikirtanj@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Hello,</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

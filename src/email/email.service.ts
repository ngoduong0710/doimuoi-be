import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendResetPasswordCode(email: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .email-container {
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo {
                    width: 300px;
                    height: 66px;
                    margin-bottom: 20px;
                }
                h1 {
                    color: #2c3e50;
                    font-size: 24px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .verification-code {
                    background-color: #f8f9fa;
                    border-radius: 6px;
                    padding: 15px;
                    margin: 20px 0;
                    text-align: center;
                    font-size: 24px;
                    letter-spacing: 2px;
                    font-weight: bold;
                    color: #2c3e50;
                }
                .expiry-notice {
                    color: #666666;
                    font-size: 14px;
                    text-align: center;
                    margin: 20px 0;
                }
                .warning {
                    color: #95a5a6;
                    font-size: 13px;
                    text-align: center;
                    margin-top: 30px;
                    font-style: italic;
                }
                .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    text-align: center;
                    font-size: 12px;
                    color: #95a5a6;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dsutqg1fy/image/upload/v1736267800/Logo_doimuoi_vwkn7l.png" alt="Company Logo" class="logo">
                </div>

                <h1>Password Reset Request</h1>

                <p>Hello,</p>

                <p>We received a request to reset your password. Here's your verification code:</p>

                <div class="verification-code">
                    ${code}
                </div>

                <p class="expiry-notice">⏰ This code will expire in 15 minutes</p>

                <div class="warning">
                    If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                </div>

                <div class="footer">
                    <p>This is an automated message, please do not reply to this email.</p>
                    <p>&copy; 2025 Your Company Name. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    })
  }

  async sendPasswordChangedNotification(email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Changed Successfully',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Changed</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .email-container {
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo {
                    width: 300px;
                    height: 66px;
                    margin-bottom: 20px;
                }
                h1 {
                    color: #2c3e50;
                    font-size: 24px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                p {
                    text-align: center;
                    margin: 10px 0;
                }
                .success-message {
                    background-color: #dff0d8;
                    border-radius: 6px;
                    padding: 15px;
                    margin: 20px 0;
                    text-align: center;
                    font-size: 18px;
                    color: #3c763d;
                    font-weight: bold;
                }
                .warning {
                    color: #95a5a6;
                    font-size: 13px;
                    text-align: center;
                    margin-top: 30px;
                    font-style: italic;
                }
                .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    text-align: center;
                    font-size: 12px;
                    color: #95a5a6;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dsutqg1fy/image/upload/v1736267800/Logo_doimuoi_vwkn7l.png" alt="Company Logo" class="logo">
                </div>

                <h1>Password Changed</h1>

                <p class="success-message">Your password has been changed successfully.</p>

                <div class="warning">
                    If you did not make this change, please contact support immediately.
                </div>

                <div class="footer">
                    <p>This is an automated message, please do not reply to this email.</p>
                    <p>&copy; 2025 Your Company Name. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    })
  }
}

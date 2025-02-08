import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { User } from '@database/entities/user.entity';
import { ConfigService } from '@nestjs/config';

export interface MailData {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: any[];
}

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail') private mailQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmationEmail(user: User) {
    const mailData: MailData = {
      to: user.email,
      subject: 'Please confirm your email address',
      text: `Click here to confirm your email address: ${this.configService.get('APP_URL')}/auth/confirm/${user.token}`,
    };

    await this.mailQueue.add('mail', mailData);
    return true;
  }

  async sendMail(mailData: MailData) {
    await this.mailQueue.add('mail', mailData);
    return 'Mail sent';
  }

  getHello(): string {
    return 'Hello World!';
  }
}

import { Logger, Module } from '@nestjs/common';
import { BullModule, OnWorkerEvent } from '@nestjs/bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';
import { MailData } from './mail.service';

@Processor('mail')
export class MailProcessor extends WorkerHost {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private configService: ConfigService) {
    super();
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async process(job: Job<MailData>) {
    this.logger.log('Sending email');
    const { to, subject, text, html, attachments } = job.data;
    
    try {
      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM'),
        to,
        subject,
        text,
        html,
        attachments,
      });
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  @OnWorkerEvent('completed')
    onJobCompleted(job: Job<MailData>) {
        this.logger.log(`Mail sent to ${job.data.to}`);
    }
} 

import { OnWorkerEvent } from '@nestjs/bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';
import { MailData } from './mail.service';
import { LoggingService } from '@shared/logging/logging.service';

@Processor('mail')
export class MailProcessor extends WorkerHost {
  private transporter: nodemailer.Transporter;
  private readonly mailLogger;

  constructor(
    private configService: ConfigService,
    private readonly loggingService: LoggingService,
  ) {
    super();
    this.initializeTransporter();
    this.mailLogger = this.loggingService.getLogger('mail');
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
    this.mailLogger.info('Sending email', {
      to: job.data.to,
      subject: job.data.subject,
      templateName: job.data.templateName,
      jobId: job.id,
    });

    const { to, subject, templateName, html, attachments } = job.data;

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to,
        subject,
        html,
        attachments,
      });
      this.mailLogger.info('Email sent successfully', {
        jobId: job.id,
        to: job.data.to,
      });
    } catch (error) {
      this.mailLogger.error('Failed to send email', {
        jobId: job.id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onJobCompleted(job: Job<MailData>) {
    this.mailLogger.info('Mail job completed', {
      jobId: job.id,
      to: job.data.to,
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { join } from 'path';
import * as ejs from 'ejs';
import * as fs from 'fs/promises';

export interface MailData {
  to: string | string[];
  subject: string;
  templateName: string;
  html?: string;
  attachments?: any[];
}

interface SendMailResponse {
  status: 'queued' | 'error';
  message: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(@InjectQueue('mail') private mailQueue: Queue) {}

  async sendMail(
    mailData: MailData,
    context: Record<string, unknown>,
  ): Promise<SendMailResponse> {
    try {
      // Render template
      mailData.html = await this.renderTemplate(mailData.templateName, context);

      // Add to queue
      await this.mailQueue.add('mail', mailData, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });

      this.logger.log(`Mail queued successfully to ${mailData.to}`);
      return { status: 'queued', message: 'Mail queued successfully' };
    } catch (error) {
      this.logger.error(`Failed to queue mail: ${error.message}`, error.stack);
      return {
        status: 'error',
        message: `Failed to queue mail: ${error.message}`,
      };
    }
  }

  async renderTemplate(
    templateName: string,
    context: Record<string, unknown>,
  ): Promise<string> {
    try {
      const templatePath = join(__dirname, 'templates', `${templateName}.ejs`);

      // Check if template exists
      await fs.access(templatePath);

      return await ejs.renderFile(templatePath, context);
    } catch (error) {
      this.logger.error(
        `Template rendering failed: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `Failed to render template ${templateName}: ${error.message}`,
      );
    }
  }
}

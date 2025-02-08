import { Controller, Get } from '@nestjs/common';
import { MailData, MailService } from '@mail/mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  async sendMail(): Promise<string> {
    const mailData: MailData = {
      to: 'joahnnes@blackbeetle.de',
      subject: 'Test',
      text: 'Hello World!',
    };

    return await this.mailService.sendMail(mailData);
  }
}

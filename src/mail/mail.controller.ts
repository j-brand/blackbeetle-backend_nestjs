import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';


@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() sendMailDto: SendMailDto) {
    const { to, subject, templateName, context } = sendMailDto;
    
    const result = await this.mailService.sendMail(
      { to, subject, templateName },
      context
    );

    if (result.status === 'error') {
      throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { 
      statusCode: HttpStatus.CREATED,
      message: result.message 
    };
  }
}

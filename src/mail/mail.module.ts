import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailService } from '@mail/mail.service';
import { MailProcessor } from '@mail/mail.processor';
import { ConfigModule } from '@nestjs/config';
import { MailController } from '@mail/mail.controller';
import { LoggingModule } from '@shared/logging/logging.module';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: 'mail',
    }),
    LoggingModule,
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}

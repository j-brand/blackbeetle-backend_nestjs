import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();

export const queueConfig = BullModule.forRoot({
  connection: {
    host: configService.get<string>('BULL_HOST'),
    port: configService.get<number>('BULL_PORT'),
  },
  defaultJobOptions: {
    removeOnComplete: 1000,
    removeOnFail: 5000,
    attempts: 3,
  },
});

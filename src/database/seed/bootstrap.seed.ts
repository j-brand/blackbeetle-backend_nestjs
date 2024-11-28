import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { Logger } from '@nestjs/common';
import { Seeder } from './seed.seeder';
import { Queue, QueueEvents } from 'bullmq';

async function bootstrap() {
  Logger.log('Seeding started', 'Seeder');
  const app = await NestFactory.createApplicationContext(AppModule);

  const seeder = new Seeder(app);

  try {
    await seeder.seed();

    const redisConnectionOptions = {
      host: process.env.BULL_HOST,
      port: parseInt(process.env.BULL_PORT, 10),
    };

    const queueEvents = new QueueEvents('image', {
      connection: redisConnectionOptions,
    });
    const queue = new Queue('image', { connection: redisConnectionOptions });
    
    // Wait for the image queue to be finished
    await new Promise<void>((resolve, reject) => {
      const onCompleted = async () => {
        const jobCounts = await queue.getJobCounts('wait', 'active');
        if (jobCounts.wait === 0 && jobCounts.active === 0) {
          cleanup();
          resolve();
        }
      };

      const onFailed = (jobId, failedReason) => {
        cleanup();
        reject(new Error(`Job ${jobId} failed: ${failedReason}`));
      };

      const cleanup = () => {
        queueEvents.off('completed', onCompleted);
        queueEvents.off('failed', onFailed);
      };

      queueEvents.on('completed', onCompleted);
      queueEvents.on('failed', onFailed);
    });
    await queue.close();
    await queueEvents.close();
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();

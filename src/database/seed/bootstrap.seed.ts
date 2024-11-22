import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { Logger } from '@nestjs/common';
import { Seeder } from './seed.seeder';

async function bootstrap() {
  Logger.log('Seeding started', 'Seeder');
  const app = await NestFactory.createApplicationContext(AppModule);

  const seeder = new Seeder(app);

  try {
    await seeder.seed();
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();

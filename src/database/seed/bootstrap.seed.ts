import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Seeder } from './users.seeder';

async function bootstrap() {
    
  console.log('Seeding started');
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(Seeder);
  try {
    await seeder.generate(8);
    console.log('Seeding complete');
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();

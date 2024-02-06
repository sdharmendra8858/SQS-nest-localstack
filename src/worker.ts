import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  require('./utils/sqs-v2-consumer');
  app.close();
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(0);
});

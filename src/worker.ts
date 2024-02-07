import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function runWorker() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const server = express();
  server.get('/health', (req, res) => {
    return res.send('Health check');
  });

  server.listen(3002, () => {
    console.log('Listening on port 3002');
  });

  require('./utils/sqs-v2-consumer-external');
  app.close();
}

runWorker().catch((e) => {
  console.error(e);
  process.exit(0);
});

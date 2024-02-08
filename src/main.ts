import { NestFactory } from '@nestjs/core';
import expressListRoutes from 'express-list-routes';

import { AppModule, WorkerModule } from './app.module';

const moduleName = process.argv[2];

async function bootstrap(moduleName: string) {
  let app: any;

  if (moduleName === 'worker') {
    app = await NestFactory.create(WorkerModule);
    const worker = await NestFactory.createApplicationContext(AppModule);
    require('./utils/sqs-v2-consumer-external');
    worker.close().catch((err) => {
      console.error(err);
      process.exit(1);
    });
  } else {
    app = await NestFactory.create(AppModule);
  }

  await app.listen(3000).then(async () => {
    expressListRoutes(app.getHttpServer()._events.request._router);
  });
}
bootstrap(moduleName).catch((err) => {
  console.error(err);
  process.exit(1);
});

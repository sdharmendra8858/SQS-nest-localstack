import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsV2SqsModule } from './modules/aws-v2/aws-v2-sqs.module';
import { AwsV3SqsModule } from './modules/aws-v3/aws-v3-sqs.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [AwsV2SqsModule, AwsV3SqsModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

@Module({
  imports: [HealthModule],
})
export class WorkerModule {}

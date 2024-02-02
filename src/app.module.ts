import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsV3SqsController } from './modules/aws-v3/aws-v3-sqs.controller';
import { AwsV3SqsService } from './modules/aws-v3/aws-v3-sqs.service';

@Module({
  imports: [],
  controllers: [AppController, AwsV3SqsController],
  providers: [AppService, AwsV3SqsService],
})
export class AppModule {}

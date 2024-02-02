import { Module } from '@nestjs/common';

import { AwsV3SqsController } from './aws-v3-sqs.controller';
import { AwsV3SqsService } from './aws-v3-sqs.service';

@Module({
  controllers: [AwsV3SqsController],
  providers: [AwsV3SqsService],
})
export class AwsV3SqsModule {}

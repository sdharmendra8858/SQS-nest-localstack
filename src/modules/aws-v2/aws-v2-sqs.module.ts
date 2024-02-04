import { Module } from '@nestjs/common';

import { AwsV2SqsController } from './aws-v2-sqs.controller';
import { AwsV2SqsService } from './aws-v2-sqs.service';

@Module({
  controllers: [AwsV2SqsController],
  providers: [AwsV2SqsService],
})
export class AwsV2SqsModule {}

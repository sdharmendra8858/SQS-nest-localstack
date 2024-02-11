import { Module } from '@nestjs/common';

import { AwsV2SqsController } from './aws-v2-sqs.controller';
import { AwsV2SqsService } from './aws-v2-sqs.service';
import { SqsV2Service } from 'src/utils';

@Module({
  controllers: [AwsV2SqsController],
  providers: [AwsV2SqsService, SqsV2Service],
})
export class AwsV2SqsModule {}

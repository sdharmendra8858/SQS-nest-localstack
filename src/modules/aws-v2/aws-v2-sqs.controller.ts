import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { AwsV2SqsService } from './aws-v2-sqs.service';

@Controller('/v2')
export class AwsV2SqsController {
  constructor(private awsV2SqsService: AwsV2SqsService) {}
  @Get()
  getVersion(): string {
    return this.awsV2SqsService.getAwsSdkVersion();
  }

  @Post('/list')
  getList(@Body() body: { queuePrefix?: string; nextToken?: string }) {
    return this.awsV2SqsService.getQueueList(body);
  }

  @Post('/create')
  createQueue(@Body() body: { queueName: string; fifoQueue?: boolean }) {
    return this.awsV2SqsService.createQueue(body);
  }

  @Post('/delete')
  deleteQueue(@Query('queueUrl') queueUrl: string) {
    return this.awsV2SqsService.deleteQueue(queueUrl);
  }

  @Post('/sendMessage')
  publishMessage(
    @Body() body: { message: string; attributes?: Record<string, any> },
    @Query() queueData: { queueUrl: string; msgGroupId: string },
  ) {
    return this.awsV2SqsService.publishMessage(
      queueData.queueUrl,
      queueData.msgGroupId,
      body,
    );
  }

  @Post('/getMessage')
  getMessage(@Query('queueUrl') queueUrl: string) {
    return this.awsV2SqsService.consumeMessage(queueUrl);
  }

  @Post('/deleteMessage')
  deleteMessage(
    @Query('queueUrl') queueUrl: string,
    @Body('receiptHandler') receiptHandler: string,
  ) {
    return this.awsV2SqsService.deleteMessage(queueUrl, receiptHandler);
  }
}

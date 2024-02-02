import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { AwsV3SqsService } from './aws-v3-sqs.service';

@Controller('/v3')
export class AwsV3SqsController {
  constructor(private awsV3SqsService: AwsV3SqsService) {}
  @Get()
  getHello(): string {
    return this.awsV3SqsService.getHello();
  }

  @Get('/list')
  getList() {
    return this.awsV3SqsService.getQueueList();
  }

  @Post('/create')
  createQueue(@Body() body: { queueName: string; fifoQueue?: boolean }) {
    return this.awsV3SqsService.createQueue(body);
  }

  @Post('/delete')
  deleteQueue(@Query('queueUrl') queueUrl: string) {
    return this.awsV3SqsService.deleteQueue(queueUrl);
  }

  @Post('/sendMessage')
  publishMessage(
    @Body() body: { message: string; attributes?: Record<string, any> },
    @Query() queueData: { queueUrl: string; msgGroupId: string },
  ) {
    return this.awsV3SqsService.publishMessage(
      queueData.queueUrl,
      queueData.msgGroupId,
      body,
    );
  }

  @Post('/getMessage')
  getMessage(@Query('queueUrl') queueUrl: string) {
    return this.awsV3SqsService.receiveMessage(queueUrl);
  }

  @Post('/deleteMessage')
  deleteMessage(
    @Query('queueUrl') queueUrl: string,
    @Body('receiptHandler') receiptHandler: string,
  ) {
    return this.awsV3SqsService.deleteMessage(queueUrl, receiptHandler);
  }
}

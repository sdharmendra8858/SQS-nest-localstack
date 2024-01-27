import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/list')
  getList() {
    return this.appService.getQueueList();
  }

  @Post('/create')
  createQueue(@Body() body: { queueName: string; fifoQueue?: boolean }) {
    return this.appService.createQueue(body);
  }

  @Post('/delete')
  deleteQueue(@Query('queueUrl') queueUrl: string) {
    return this.appService.deleteQueue(queueUrl);
  }

  @Post('/sendMessage')
  publishMessage(
    @Body() body: { message: string; attributes?: Record<string, any> },
    @Query() queueData: { queueUrl: string; msgGroupId: string },
  ) {
    return this.appService.publishMessage(
      queueData.queueUrl,
      queueData.msgGroupId,
      body,
    );
  }

  @Post('/getMessage')
  getMessage(@Query('queueUrl') queueUrl: string) {
    return this.appService.receiveMessage(queueUrl);
  }

  @Post('/deleteMessage')
  deleteMessage(
    @Query('queueUrl') queueUrl: string,
    @Body('receiptHandler') receiptHandler: string,
  ) {
    return this.appService.deleteMessage(queueUrl, receiptHandler);
  }
}

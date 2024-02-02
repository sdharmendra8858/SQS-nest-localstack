import { Injectable } from '@nestjs/common';

import { sqsService } from 'src/utils';

@Injectable()
export class AwsV3SqsService {
  getHello(): string {
    return 'Hello World!';
  }

  getQueueList() {
    return sqsService.listQueue();
  }

  createQueue(queueData: { queueName: string; fifoQueue?: boolean }) {
    return sqsService.createQueue(queueData.queueName, queueData.fifoQueue);
  }

  deleteQueue(queueUrl: string) {
    return sqsService.deleteQueue(queueUrl);
  }

  publishMessage(
    queueUrl: string,
    msgGroupId: string,
    messageData: { message: string; attributes?: Record<string, any> },
  ) {
    return sqsService.publishMessage(
      queueUrl,
      msgGroupId,
      messageData.message,
      messageData.attributes,
    );
  }

  receiveMessage(queueUrl: string) {
    return sqsService.receiveMessage(queueUrl);
  }

  deleteMessage(queueUrl: string, receiptHandler: string) {
    return sqsService.deleteMessage(queueUrl, receiptHandler);
  }
}

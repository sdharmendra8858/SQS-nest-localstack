import { Injectable } from '@nestjs/common';

import { sqsV3Service } from 'src/utils';

@Injectable()
export class AwsV3SqsService {
  getAwsSdkVersion(): string {
    return 'Aws SDK version v3';
  }

  getQueueList() {
    return sqsV3Service.listQueue();
  }

  createQueue(queueData: { queueName: string; fifoQueue?: boolean }) {
    return sqsV3Service.createQueue(queueData.queueName, queueData.fifoQueue);
  }

  deleteQueue(queueUrl: string) {
    return sqsV3Service.deleteQueue(queueUrl);
  }

  publishMessage(
    queueUrl: string,
    msgGroupId: string,
    messageData: { message: string; attributes?: Record<string, any> },
  ) {
    return sqsV3Service.publishMessage(
      queueUrl,
      msgGroupId,
      messageData.message,
      messageData.attributes,
    );
  }

  receiveMessage(queueUrl: string) {
    return sqsV3Service.receiveMessage(queueUrl);
  }

  deleteMessage(queueUrl: string, receiptHandler: string) {
    return sqsV3Service.deleteMessage(queueUrl, receiptHandler);
  }
}

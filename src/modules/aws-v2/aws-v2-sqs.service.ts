import { Injectable } from '@nestjs/common';

import { sqsV2Service } from 'src/utils';

@Injectable()
export class AwsV2SqsService {
  getAwsSdkVersion(): string {
    return 'Aws SDK version v2';
  }

  getQueueList(body: { queuePrefix?: string; nextToken?: string }) {
    return sqsV2Service.listQueue(body.queuePrefix, body.nextToken);
  }

  createQueue(queueData: { queueName: string; fifoQueue?: boolean }) {
    return sqsV2Service.createQueue(queueData.queueName, queueData.fifoQueue);
  }

  deleteQueue(queueUrl: string) {
    return sqsV2Service.deleteQueue(queueUrl);
  }

  publishMessage(
    queueUrl: string,
    msgGroupId: string,
    messageData: { message: string; attributes?: Record<string, any> },
  ) {
    return sqsV2Service.publishMessage(
      queueUrl,
      msgGroupId,
      messageData.message,
      messageData.attributes,
    );
  }

  consumeMessage(queueUrl: string) {
    return sqsV2Service.receiveMessage(queueUrl);
  }

  deleteMessage(queueUrl: string, receiptHandler: string) {
    return sqsV2Service.deleteMessage(queueUrl, receiptHandler);
  }
}

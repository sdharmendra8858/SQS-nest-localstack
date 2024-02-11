import { Injectable } from '@nestjs/common';
import { SQS_PUBLISHING_QUEUE } from 'src/constant';

import { SqsV2Service } from 'src/utils';
import { SqsConnection } from 'src/worker/sqsProducer';

@Injectable()
export class AwsV2SqsService {
  constructor(private sqsV2Service: SqsV2Service) {}
  getAwsSdkVersion(): string {
    return 'Aws SDK javascript version v2';
  }

  getQueueList(body: { queuePrefix?: string; nextToken?: string }) {
    return this.sqsV2Service.listQueue(body.queuePrefix, body.nextToken);
  }

  getQueueUrl(queueUrl: string) {
    return this.sqsV2Service.getQueueUrl(queueUrl);
  }

  createQueue(queueData: { queueName: string; fifoQueue?: boolean }) {
    return this.sqsV2Service.createQueue(
      queueData.queueName,
      queueData.fifoQueue,
    );
  }

  deleteQueue(queueUrl: string) {
    return this.sqsV2Service.deleteQueue(queueUrl);
  }

  async publishMessage(
    msgGroupId: string,
    messageData: { message: string; attributes?: Record<string, any> },
  ) {
    return await SqsConnection.getInstance().publishEvent({
      queueName: SQS_PUBLISHING_QUEUE.STANDARD.STANDARD_QUEUE_ONE,
      msgGroupId,
      message: messageData.message,
      attributes: messageData.attributes,
    });
  }

  consumeMessage(queueUrl: string) {
    return this.sqsV2Service.receiveMessage(queueUrl);
  }

  deleteMessage(queueUrl: string, receiptHandler: string) {
    return this.sqsV2Service.deleteMessage(queueUrl, receiptHandler);
  }
}

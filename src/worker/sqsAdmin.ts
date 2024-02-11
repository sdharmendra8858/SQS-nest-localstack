import { SQS } from 'aws-sdk';

import { sqsConfig } from 'src/config';

export class SqsAdmin {
  private static instance: SqsAdmin;

  private sqsClient: SQS = new SQS({
    region: sqsConfig.REGION,
    endpoint: sqsConfig.SERVICE_ENDPOINT,
    credentials: {
      accessKeyId: sqsConfig.IAM.ACCESS_KEY_ID,
      secretAccessKey: sqsConfig.IAM.SECRET_ACCESS_KEY,
    },
  });

  public static getInstance(): SqsAdmin {
    if (!this.instance) {
      this.instance = new SqsAdmin();
    }
    return this.instance;
  }

  public async listQueue(
    queuePrefix?: string,
    nextToken?: string,
  ): Promise<SQS.Types.ListQueuesResult> {
    try {
      console.log('Listing the queues in the SQS admin');
      return await this.sqsClient
        .listQueues({
          ...(nextToken && { NextToken: nextToken }),
          ...(queuePrefix && { QueueNamePrefix: queuePrefix }),
          MaxResults: 10,
        })
        .promise();
    } catch (err) {
      console.error('Error while fetching the queue list');
      return err;
    }
  }

  public async listAllQueue(): Promise<string[]> {
    const queueList = [];
    let nextToken = null;
    while (true) {
      const queues = await this.listQueue('', nextToken);
      queueList.push(...queues.QueueUrls);
      if (!queues.NextToken) {
        break;
      }
      nextToken = queues.NextToken;
    }
    return queueList;
  }

  public async getQueueUrl(
    queueName: string,
  ): Promise<SQS.Types.GetQueueUrlResult> {
    try {
      return await this.sqsClient
        .getQueueUrl({
          QueueName: queueName,
        })
        .promise();
    } catch (err) {
      console.error('Error while getting the queue url');
      return err;
    }
  }

  async createQueue(
    queueName: string,
    fifoQueue = false,
  ): Promise<SQS.Types.CreateQueueResult> {
    try {
      console.log(`Creating the queue with : ${queueName}`);
      const attributes = {};
      if (fifoQueue) {
        attributes['FifoQueue'] = 'true';
        attributes['ContentBasedDeduplication'] = 'true';
      }
      const queueDetails = {
        QueueName: `${queueName}${fifoQueue ? '.fifo' : ''}`,
        ...(fifoQueue && { Attributes: attributes }),
      };
      const result = await this.sqsClient.createQueue(queueDetails).promise();
      return result;
    } catch (err) {
      console.error('Error while creating the Queue', err);
      return err;
    }
  }

  public async publishMessage(
    queueUrl: string,
    msgGroupId: string,
    message: string,
    attributes?: Record<string, any>,
  ): Promise<SQS.Types.SendMessageResult> {
    try {
      console.log(
        `Sending the message with : ${message}, ${JSON.stringify(attributes)}`,
      );
      console.log(`Sending message in queueUrl : ${queueUrl}`);
      const params: SQS.Types.SendMessageRequest = {
        QueueUrl: queueUrl,
        MessageBody: message,
        MessageAttributes: attributes,
        ...(msgGroupId && { MessageGroupId: msgGroupId }),
        ...(msgGroupId && { MessageDeduplicationId: Date.now().toString() }),
      };

      return await this.sqsClient.sendMessage(params).promise();
    } catch (err) {
      console.error('Error while sending the message');
      return err;
    }
  }
}

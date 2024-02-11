import { SQS } from 'aws-sdk';
import { Injectable } from '@nestjs/common';

import { sqsConfig } from '../../config';

@Injectable()
export class SqsV2Service {
  private static instance: SqsV2Service;

  private sqsClient = new SQS({
    region: sqsConfig.REGION,
    endpoint: sqsConfig.SERVICE_ENDPOINT,
    credentials: {
      accessKeyId: sqsConfig.IAM.ACCESS_KEY_ID,
      secretAccessKey: sqsConfig.IAM.SECRET_ACCESS_KEY,
    },
  });

  public getSqsClient() {
    return this.sqsClient;
  }

  public static getInstance(): SqsV2Service {
    if (!SqsV2Service.instance) {
      SqsV2Service.instance = new SqsV2Service();
    }
    return SqsV2Service.instance;
  }

  public async listQueue(
    queuePrefix?: string,
    nextToken?: string,
  ): Promise<SQS.Types.ListQueuesResult> {
    try {
      console.log('Listing the queues in the SQS v2');
      return await this.sqsClient
        .listQueues({
          ...(nextToken && { NextToken: nextToken }),
          ...(queuePrefix && { QueueNamePrefix: queuePrefix }),
          MaxResults: 10,
        })
        .promise();
    } catch (err) {
      console.error('Error while fetching the queue list v2');
      return err;
    }
  }

  public async listAllQueue(): Promise<string[]> {
    console.log('Listing all the queue');
    try {
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
    } catch (err) {
      console.error('Error while fetching all the queues');
      throw err;
    }
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

  public async deleteQueue(queueUrl: string): Promise<{}> {
    try {
      console.log(`Deleting the queue : ${queueUrl}`);
      return await this.sqsClient
        .deleteQueue({
          QueueUrl: queueUrl,
        })
        .promise();
    } catch (err) {
      console.error('Error while deleting the queue');
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

  public async receiveMessage(
    queueUrl: string,
  ): Promise<SQS.Types.ReceiveMessageResult> {
    try {
      console.log(`Receiving the message from : ${queueUrl}`);
      const params: SQS.Types.ReceiveMessageRequest = {
        QueueUrl: queueUrl,
        AttributeNames: ['All'],
        MessageAttributeNames: ['All'],
        MaxNumberOfMessages: 10,
      };

      return await this.sqsClient.receiveMessage(params).promise();
    } catch (err) {
      console.error('Error while fetching message');
      return err;
    }
  }

  public async deleteMessage(queueUrl: string, receiptHandler: string) {
    try {
      console.log(`Deleting the message from : ${queueUrl}`);
      console.log(`Deleting the message with receipt : ${receiptHandler}`);
      const params = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandler,
      };

      return await this.sqsClient.deleteMessage(params).promise();
    } catch (err) {
      console.error('Error while deleting the message');
      return err;
    }
  }
}

import { SQS } from 'aws-sdk';

import { sqsConfig } from './../config';

class SqsV2Service {
  private initSqs() {
    return new SQS({
      region: sqsConfig.REGION,
      endpoint: sqsConfig.SERVICE_ENDPOINT,
      credentials: {
        accessKeyId: sqsConfig.IAM.ACCESS_KEY_ID,
        secretAccessKey: sqsConfig.IAM.SECRET_ACCESS_KEY,
      },
    });
  }

  public async listQueue(
    queuePrefix?: string,
    nextToken?: string,
  ): Promise<SQS.Types.ListQueuesResult> {
    try {
      console.log('Listing the queues in the SQS');
      const sqsClient = this.initSqs();
      return await sqsClient
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

  async createQueue(
    queueName: string,
    fifoQueue = false,
  ): Promise<SQS.Types.CreateQueueResult> {
    try {
      console.log(`Creating the queue with : ${queueName}`);
      const sqsClient = this.initSqs();
      const attributes = {};
      if (fifoQueue) {
        attributes['FifoQueue'] = 'true';
        attributes['ContentBasedDeduplication'] = 'true';
      }
      const queueDetails = {
        QueueName: `${queueName}${fifoQueue ? '.fifo' : ''}`,
        ...(fifoQueue && { Attributes: attributes }),
      };
      const result = await sqsClient.createQueue(queueDetails).promise();
      return result;
    } catch (err) {
      console.error('Error while creating the Queue', err);
      return err;
    }
  }

  public async deleteQueue(queueUrl: string): Promise<{}> {
    try {
      console.log(`Deleting the queue : ${queueUrl}`);
      const sqsClient = this.initSqs();
      return await sqsClient
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
      const sqsClient = this.initSqs();
      const params: SQS.Types.SendMessageRequest = {
        QueueUrl: queueUrl,
        MessageBody: message,
        MessageAttributes: attributes,
        MessageGroupId: msgGroupId,
      };

      return await sqsClient.sendMessage(params).promise();
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
      const sqsClient = this.initSqs();
      const params: SQS.Types.ReceiveMessageRequest = {
        QueueUrl: queueUrl,
        AttributeNames: ['All'],
        MessageAttributeNames: ['All'],
        MaxNumberOfMessages: 10,
      };

      return await sqsClient.receiveMessage(params).promise();
    } catch (err) {
      console.error('Error while fetching message');
      return err;
    }
  }

  public async deleteMessage(queueUrl: string, receiptHandler: string) {
    try {
      console.log(`Deleting the message from : ${queueUrl}`);
      console.log(`Deleting the message with receipt : ${receiptHandler}`);
      const sqsClient = this.initSqs();
      const params = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandler,
      };

      return await sqsClient.deleteMessage(params).promise();
    } catch (err) {
      console.error('Error while deleting the message');
      return err;
    }
  }
}

export const sqsV2Service = new SqsV2Service();

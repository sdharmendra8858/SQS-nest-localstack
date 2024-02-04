import {
  CreateQueueCommand,
  CreateQueueCommandInput,
  DeleteMessageCommand,
  DeleteMessageCommandInput,
  DeleteMessageCommandOutput,
  DeleteQueueCommand,
  DeleteQueueCommandInput,
  DeleteQueueCommandOutput,
  ListQueuesCommand,
  ListQueuesCommandInput,
  ListQueuesCommandOutput,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
  ReceiveMessageCommandOutput,
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageCommandOutput,
} from '@aws-sdk/client-sqs';

import { sqsConfig } from '../config';

class SqsV3Service {
  private readonly client = new SQSClient({
    region: sqsConfig.REGION,
    endpoint: sqsConfig.SERVICE_ENDPOINT,
    credentials: {
      accessKeyId: sqsConfig.IAM.ACCESS_KEY_ID,
      secretAccessKey: sqsConfig.IAM.SECRET_ACCESS_KEY,
    },
  });

  public async listQueue(): Promise<ListQueuesCommandOutput> {
    try {
      console.log('Listing the queues in the SQS');

      const input: ListQueuesCommandInput = {
        MaxResults: 10,
      };

      const command = new ListQueuesCommand(input);
      return await this.client.send(command);
    } catch (err) {
      console.error('Error while fetching the queue list');
      return err;
    }
  }

  public async createQueue(queueName: string, fifoQueue?: boolean) {
    try {
      console.log(`Creating the queue with : ${queueName}`);
      const attributes = {};
      if (fifoQueue) {
        attributes['FifoQueue'] = 'true';
        attributes['ContentBasedDeduplication'] = 'true';
      }
      const input: CreateQueueCommandInput = {
        QueueName: `${queueName}${fifoQueue ? '.fifo' : ''}`,
        ...(fifoQueue && { Attributes: attributes }),
      };

      const command = new CreateQueueCommand(input);

      return await this.client.send(command);
    } catch (err) {
      console.error('Error while creating the queue');
      return err;
    }
  }

  public async deleteQueue(
    queueUrl: string,
  ): Promise<DeleteQueueCommandOutput> {
    try {
      console.log(`Deleting the queue : ${queueUrl}`);
      const input: DeleteQueueCommandInput = {
        QueueUrl: queueUrl,
      };

      const command = new DeleteQueueCommand(input);
      return await this.client.send(command);
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
  ): Promise<SendMessageCommandOutput> {
    try {
      console.log(
        `Sending the message with : ${message}, ${JSON.stringify(attributes)}`,
      );
      console.log(`Sending message in queueUrl : ${queueUrl}`);

      const input: SendMessageCommandInput = {
        QueueUrl: queueUrl,
        MessageBody: message,
        MessageAttributes: attributes,
        MessageGroupId: msgGroupId,
      };

      const command = new SendMessageCommand(input);
      return await this.client.send(command);
    } catch (err) {
      console.error('Error while sending the message');
      return err;
    }
  }

  public async receiveMessage(
    queueUrl: string,
  ): Promise<ReceiveMessageCommandOutput> {
    try {
      console.log(`Receiving the message from : ${queueUrl}`);
      const input: ReceiveMessageCommandInput = {
        QueueUrl: queueUrl,
        AttributeNames: ['All'],
        MessageAttributeNames: ['All'],
        MaxNumberOfMessages: 1,
      };

      const command = new ReceiveMessageCommand(input);
      return await this.client.send(command);
    } catch (err) {
      console.error('Error while fetching message');
      return err;
    }
  }

  public async deleteMessage(
    queueUrl: string,
    receiptHandler: string,
  ): Promise<DeleteMessageCommandOutput> {
    try {
      console.log(`Deleting the message from : ${queueUrl}`);
      console.log(`Deleting the message with receipt : ${receiptHandler}`);
      const input: DeleteMessageCommandInput = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandler,
      };
      const command = new DeleteMessageCommand(input);
      return await this.client.send(command);
    } catch (err) {
      console.error('Error while deleting the message');
      return err;
    }
  }
}

export const sqsV3Service = new SqsV3Service();

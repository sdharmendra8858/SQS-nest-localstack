import { SQS } from 'aws-sdk';

import { sqsConfig } from 'src/config';
import { createSqsQueueIfNotExist, getQueueUrlFromQueueName } from '../utils';

export class SqsConnection {
  private static instance: SqsConnection;

  private sqsClient: SQS;

  private isProducerConnected: boolean = false;

  public static getInstance(): SqsConnection {
    if (!this.instance) {
      this.instance = new SqsConnection();
    }
    return this.instance;
  }

  public static getSqsClient(): SQS {
    return new SQS({
      region: sqsConfig.REGION,
      endpoint: sqsConfig.SERVICE_ENDPOINT,
      credentials: {
        accessKeyId: sqsConfig.IAM.ACCESS_KEY_ID,
        secretAccessKey: sqsConfig.IAM.SECRET_ACCESS_KEY,
      },
    });
  }

  public async publishEvent(data: {
    queueName: string;
    msgGroupId: string;
    message: string;
    attributes?: Record<string, any>;
  }): Promise<SQS.Types.SendMessageResult> {
    try {
      console.log(
        `Sending the message with : ${data.message}, ${JSON.stringify(data.attributes)}`,
      );
      await createSqsQueueIfNotExist();
      const queueUrl = getQueueUrlFromQueueName(
        data.queueName,
        !!data.msgGroupId,
      );
      // const queueUrl = `${sqsConfig.URL_STRUCT}/${data.queueName}${data.msgGroupId ? '.fifo' : ''}`;
      console.log(`Sending message in queueUrl : ${queueUrl}`);
      const params: SQS.Types.SendMessageRequest = {
        QueueUrl: queueUrl,
        MessageBody: data.message,
        MessageAttributes: data.attributes,
        ...(data.msgGroupId && { MessageGroupId: data.msgGroupId }),
        ...(data.msgGroupId && {
          MessageDeduplicationId: Date.now().toString(),
        }),
      };

      if (!this.isProducerConnected) {
        this.sqsClient = SqsConnection.getSqsClient();
      }
      return await this.sqsClient.sendMessage(params).promise();
    } catch (err) {
      console.error('Error while sending the message');
      return err;
    }
  }
}

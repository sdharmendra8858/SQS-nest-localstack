import { SQS } from 'aws-sdk';
import { Consumer } from 'sqs-consumer';

import { sqsConfig } from '../../config';
import { SqsV2Service } from '../../utils/sqs/sqs-v2';

export default abstract class SqsConsumer {
  private connection: SQS;

  constructor(data: {
    queueName: string;
    fifo: boolean;
    attributeNames?: string;
    maxNumberOfMsg?: number;
    visibilityTimeout?: number;
    waitTimeSec?: number;
  }) {
    const subscribeConfig = {
      queueUrl: `${sqsConfig.URL_STRUCT}/${data.queueName}${data.fifo ? '.fifo' : ''}`,
      attributeNames: [data.attributeNames || 'All'],
      maxNumberOfMessages: data.maxNumberOfMsg || 1,
      ...(data.visibilityTimeout && {
        visibilityTimeout: data.visibilityTimeout,
      }),
      ...(data.waitTimeSec && { waitTimeSeconds: data.waitTimeSec }),
    };

    this.subscribe(subscribeConfig).catch((err) =>
      console.info(`Error consuming :: ${err.message}`),
    );
  }

  public async subscribe(subscribeConfig) {
    const {
      queueUrl,
      AttributeNames,
      MaxNumberOfMessages,
      visibilityTimeout,
      waitTimeSec,
    } = subscribeConfig;
    console.log(`Sqs consumer starting ${JSON.stringify(subscribeConfig)}`);
    if (!this.handleMessage) {
      throw new Error(`${this.constructor.name}.handleMessage() not found`);
    }

    if (!queueUrl) {
      throw new Error('Queue not found');
    }

    try {
      this.connection = SqsV2Service.getInstance().getSqsClient();

      const consumer = Consumer.create({
        queueUrl: queueUrl,
        handleMessage: this.handleMessage,
        sqs: this.connection,
      });

      consumer.on('error', (err) => {
        console.error(err.message);
      });

      consumer.on('processing_error', (err) => {
        console.error(err.message);
      });

      consumer.on('timeout_error', (err) => {
        console.error(err.message);
      });

      consumer.start();
    } catch (err) {
      console.info(
        `SqsConsumer Error Topic : ${queueUrl} :: :: ${err.message}`,
      );
    }
  }

  abstract handleMessage(message: any): Promise<any>;
}

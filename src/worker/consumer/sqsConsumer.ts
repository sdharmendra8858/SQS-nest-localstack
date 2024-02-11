import { SQS } from 'aws-sdk';
import { Consumer } from 'sqs-consumer';

import { sqsConfig } from '../../config';
import { SqsV2Service } from '../../utils/sqs/sqs-v2';
import { createSqsQueueIfNotExist } from '../../utils';

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

  private handleError(err) {
    console.error('Error in SQS events -> ', err);
    if (err['code'] === 'AWS.SimpleQueueService.NonExistentQueue') {
      createSqsQueueIfNotExist();
    }
  }

  public async subscribe(subscribeConfig) {
    const {
      queueUrl,
      attributeNames,
      maxNumberOfMessages,
      visibilityTimeout,
      waitTimeSec,
    } = subscribeConfig;
    console.log(`Sqs consumer starting ${JSON.stringify(subscribeConfig)}`);
    if (!this.handleMessage) {
      throw new Error(`${this.constructor.name}.handleMessage() not found`);
    }

    if (!queueUrl) {
      throw new Error('Please provide Queue to process the events');
    }

    try {
      this.connection = SqsV2Service.getInstance().getSqsClient();

      const consumer = Consumer.create({
        queueUrl: queueUrl,
        attributeNames,
        visibilityTimeout,
        waitTimeSeconds: waitTimeSec,
        handleMessage: this.handleMessage,
        sqs: this.connection,
      });

      consumer.on('error', (err) => {
        this.handleError(err);
      });

      consumer.on('processing_error', (err) => {
        this.handleError(err);
      });

      consumer.on('timeout_error', (err) => {
        this.handleError(err);
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

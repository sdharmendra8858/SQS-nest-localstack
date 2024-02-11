import { SQS_CONSUMER_QUEUE } from 'src/constant';
import SqsConsumer from './sqsConsumer';

export class ConsumeSqsTest extends SqsConsumer {
  constructor() {
    super({
      queueName: SQS_CONSUMER_QUEUE.STANDARD.STANDARD_QUEUE_ONE,
      fifo: false,
    });
  }

  async handleMessage(payload: any): Promise<any> {
    console.log('Processing for message ::', payload);
  }
}

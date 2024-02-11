import { sqsConfig } from '../../config';
import {
  SQS_PUBLISHING_QUEUE,
  QUEUE_TYPE,
  SQS_CONSUMER_QUEUE,
} from '../../constant';
import { SqsV2Service } from './sqs-v2';

export function getQueueUrlFromQueueName(queueName: string, fifo: boolean) {
  return `${sqsConfig.URL_STRUCT}/${queueName}${fifo ? '.fifo' : ''}`;
}

function getMissingQueueList(data: {
  existingQueue: string[];
  standardQueueNameSet;
  fifoQueueNameSet;
  SQS_QUEUE;
}) {
  for (const queueType in data.SQS_QUEUE) {
    const queueList = data.SQS_QUEUE[queueType];
    const isFifo = queueType === QUEUE_TYPE.FIFO;
    for (const queue in queueList) {
      const queueUrl = getQueueUrlFromQueueName(queueList[queue], isFifo);
      if (data.existingQueue.indexOf(queueUrl) < 0) {
        if (!isFifo) {
          data.standardQueueNameSet.add(queueList[queue]);
        } else {
          data.fifoQueueNameSet.add(queueList[queue]);
        }
      }
    }
  }
}

export async function createSqsQueueIfNotExist() {
  try {
    console.log('Initiating the SQS Queue Creation');
    const sqsInstance = SqsV2Service.getInstance();
    const existingQueue = await sqsInstance.listAllQueue();
    const standardQueueNameSet = new Set<string>();
    const fifoQueueNameSet = new Set<string>();
    getMissingQueueList({
      existingQueue,
      standardQueueNameSet,
      fifoQueueNameSet,
      SQS_QUEUE: SQS_PUBLISHING_QUEUE,
    });
    getMissingQueueList({
      existingQueue,
      standardQueueNameSet,
      fifoQueueNameSet,
      SQS_QUEUE: SQS_CONSUMER_QUEUE,
    });

    const standardQueueList: string[] = [...standardQueueNameSet];
    const fifoQueueList: string[] = [...fifoQueueNameSet];

    for (const queue of standardQueueList) {
      console.log('Sqs Queue Creation -->', queue);
      const res = await sqsInstance.createQueue(queue);

      console.log(`Queue created for queue --> ${queue}`, res);
    }

    for (const queue of fifoQueueList) {
      console.log('Sqs Queue Creation -->', queue);
      const res = await sqsInstance.createQueue(queue, true);

      console.log(`Queue created for queue --> ${queue}`, res);
    }
  } catch (err) {
    console.error('Failed to create the SQS Queue', err);
    throw new Error(err);
  }
}

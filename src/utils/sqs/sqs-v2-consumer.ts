import * as AWS from 'aws-sdk';

import { sqsConfig } from '../../config';
import { SqsV2Service } from './sqs-v2';
import { SQS_PUBLISHING_QUEUE } from 'src/constant';

AWS.config.update({
  region: sqsConfig.REGION,
  accessKeyId: sqsConfig.IAM.ACCESS_KEY_ID,
  secretAccessKey: sqsConfig.IAM.SECRET_ACCESS_KEY,
});

const sqs = new AWS.SQS({});
const queueUrl = SQS_PUBLISHING_QUEUE.STANDARD.STANDARD_QUEUE_ONE;
const sqsV2Service = SqsV2Service.getInstance();

// function to validate if the queue exist or not
async function validateQueueUrl() {
  if (!queueUrl) {
    throw new Error('Please provide the queue to execute the consumer');
  }

  const queueUrls = await sqsV2Service.listQueue();
  const validQueue = queueUrls.QueueUrls.includes(queueUrl);
  if (!validQueue) {
    throw new Error('Provided Queue does not exist.');
  }
}

// Function to process received messages
const processMessages = (messages) => {
  messages.forEach((message) => {
    console.log('Received message:', message);
    // TODO: Process the message as needed

    sqsV2Service.deleteMessage(queueUrl, message.ReceiptHandle);
  });
};

const receiveMessages = async () => {
  try {
    const params = {
      QueueUrl: queueUrl,
      AttributeNames: ['All'],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      VisibilityTimeout: 20,
      WaitTimeSeconds: 10,
    };
    const res = await sqs.receiveMessage(params).promise();
    processMessages(res.Messages);
  } catch (err) {
    console.log('Error receiving messages:', err);
  } finally {
    receiveMessages();
  }
};

validateQueueUrl()
  .then(() => {
    receiveMessages();
  })
  .catch((err) => {
    console.log(err);
  });

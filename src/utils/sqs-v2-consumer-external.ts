import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';

import { sqsConfig, topics } from '../config';

const sqs = new AWS.SQS({
  accessKeyId: sqsConfig.IAM.ACCESS_KEY_ID,
  secretAccessKey: sqsConfig.IAM.SECRET_ACCESS_KEY,
  region: sqsConfig.REGION,
  endpoint: sqsConfig.SERVICE_ENDPOINT,
  apiVersion: '2012-11-05',
});

var queueUrl = topics.STANDARD;

const createConsumer = Consumer.create({
  queueUrl: queueUrl,
  handleMessage: async (message) => {
    console.log('Processing for message => ', message);
  },
  sqs: sqs,
});

createConsumer.on('error', (err) => {
  console.error(err.message);
});

createConsumer.on('processing_error', (err) => {
  console.error(err.message);
});

createConsumer.on('timeout_error', (err) => {
  console.error(err.message);
});

createConsumer.start();

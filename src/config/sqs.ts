// configs for connecting to localstack
export const sqsConfig = {
  REGION: 'us-east-1',
  ACCOUNT_ID: '000000000000',
  IAM: {
    ACCESS_KEY_ID: 'na',
    SECRET_ACCESS_KEY: 'na',
  },
  SERVICE_ENDPOINT: 'http://127.0.0.1:4566',
  URL_STRUCT:
    'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000',
};

export const sqsConfig = {
    REGION: "us-east-1", // should match the one given in the docker-compose.yml file
    ACCOUNT_ID: "000000000000", // represents the dummy aws account id for localstack
    IAM: {
      ACCESS_KEY_ID: "na",
      SECRET_ACCESS_KEY: "na"
    },
    SERVICE_ENDPOINT: "http://127.0.0.1:4566", // represents the service point for localstack
    QUEUE_NAME: "geek" // queue name used in this tutorial for implementation
  };
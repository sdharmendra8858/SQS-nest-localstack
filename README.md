# Name

SQS-NEST-LOCALSTASH

## Description

This repository is for creating the connection with the SQS and NestJs. We are running the **SQS** on the local setup using the **localstash**. We are creating the complete running nest application and also a worker standalone application for running the task which are seperate from the existing functionality of the application like **CRON** job, a **CONSUMER**, etc on specific part or module of the application.

This implementation contains the v2 and v3 of the **aws-sdk** and also the consumer is written in v2, v3 and also a external module like **sqs-consumer**.

## Installation

1. To run the complete application execute the given command

   ```bash
   npm run start
   ```

2. To run the localstash and setup the sqs locally execute

   ```bash
   docker compose up
   ```

3. Create the queue using the api cURL

   ```bash
   curl --location 'http://localhost:3000/v2/create' \
   --header 'Content-Type: application/json' \
   --data '{
       "queueName": "new-standard-Queue"
   }'
   ```

   **_NOTE ::_** As of the queue names are hardcoded but can be changed in the config directory of the application

4. To run the worker

   ```bash
   node dist/worker.js
   ```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

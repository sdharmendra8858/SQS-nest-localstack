import { ConsumeSqsTest } from './consumer';

export const startSqsWorker = async () => [new ConsumeSqsTest()];

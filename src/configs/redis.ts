import { createClient } from 'redis';
import { config } from 'dotenv';
// import { Log, getProcessId } from '../utils/function';
// import moment from 'moment';

config();

export const client = createClient({
  url: process.env.REDIS_URL!,
});

(async () => {
  await client.connect();
})();
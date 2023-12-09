import { createClient } from "redis";
import { config } from "dotenv";
import logger from "./logger";
// import { Log, getProcessId } from '../utils/function';
// import moment from 'moment';

config();

export const client = createClient({
  url: process.env.REDIS_URL!,
});

(async () => {
  await client.connect();
})();

client.on("error", (err) => {
  logger.error('Redis client ' + err);
});



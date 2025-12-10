// backend/src/queue/bullmq.ts

import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const uploadQueue = new Queue("uploadQueue", {
  connection: redisConnection,
});

export const ipfsQueue = new Queue("ipfsQueue", {
  connection: redisConnection,
});

export const metadataQueue = new Queue("metadataQueue", {
  connection: redisConnection,
});

export const hederaMintQueue = new Queue("hederaMintQueue", {
  connection: redisConnection,
});

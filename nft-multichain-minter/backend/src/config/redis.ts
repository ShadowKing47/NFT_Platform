import IORedis from "ioredis";
import { URL } from "url";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisUrl = new URL(REDIS_URL);

/**
 * Redis connection configuration
 * Exported for BullMQ queue configuration
 */
export const redisConnection = {
    host: redisUrl.hostname,
    port: Number(redisUrl.port) || 6379,
    password: redisUrl.password || undefined,
    username: redisUrl.username || undefined,
    db: redisUrl.pathname ? Number(redisUrl.pathname.slice(1)) || 0 : 0,
};

const redisClient = new IORedis(REDIS_URL);

export default redisClient;

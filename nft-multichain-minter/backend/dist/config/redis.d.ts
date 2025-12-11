import IORedis from "ioredis";
/**
 * Redis connection configuration
 * Exported for BullMQ queue configuration
 */
export declare const redisConnection: {
    host: string;
    port: number;
    password: string | undefined;
    username: string | undefined;
    db: number;
};
declare const redisClient: IORedis;
export default redisClient;
//# sourceMappingURL=redis.d.ts.map
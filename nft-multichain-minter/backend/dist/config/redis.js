"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const url_1 = require("url");
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const redisUrl = new url_1.URL(REDIS_URL);
/**
 * Redis connection configuration
 * Exported for BullMQ queue configuration
 */
exports.redisConnection = {
    host: redisUrl.hostname,
    port: Number(redisUrl.port) || 6379,
    password: redisUrl.password || undefined,
    username: redisUrl.username || undefined,
    db: redisUrl.pathname ? Number(redisUrl.pathname.slice(1)) || 0 : 0,
};
const redisClient = new ioredis_1.default(REDIS_URL);
exports.default = redisClient;
//# sourceMappingURL=redis.js.map
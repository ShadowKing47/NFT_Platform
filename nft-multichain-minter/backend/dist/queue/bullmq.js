"use strict";
// backend/src/queue/bullmq.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.hederaMintQueue = exports.metadataQueue = exports.ipfsQueue = exports.uploadQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.uploadQueue = new bullmq_1.Queue("uploadQueue", {
    connection: redis_1.redisConnection,
});
exports.ipfsQueue = new bullmq_1.Queue("ipfsQueue", {
    connection: redis_1.redisConnection,
});
exports.metadataQueue = new bullmq_1.Queue("metadataQueue", {
    connection: redis_1.redisConnection,
});
exports.hederaMintQueue = new bullmq_1.Queue("hederaMintQueue", {
    connection: redis_1.redisConnection,
});
//# sourceMappingURL=bullmq.js.map
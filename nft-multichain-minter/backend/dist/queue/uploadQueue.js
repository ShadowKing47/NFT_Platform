"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadQueue = void 0;
exports.addFileUploadJob = addFileUploadJob;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
/**
 * Queue for file upload operations
 */
exports.uploadQueue = new bullmq_1.Queue("uploadQueue", {
    connection: redis_1.redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
    },
});
/**
 * Add file upload job to queue
 */
async function addFileUploadJob(filePath, originalName, mimeType, size, walletAddress, chain) {
    const job = await exports.uploadQueue.add("upload-file", {
        filePath,
        originalName,
        mimeType,
        size,
        walletAddress,
        chain,
    });
    return job.id;
}
exports.default = exports.uploadQueue;
//# sourceMappingURL=uploadQueue.js.map
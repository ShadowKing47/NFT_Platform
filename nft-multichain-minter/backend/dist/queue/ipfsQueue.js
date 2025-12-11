"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipfsQueue = void 0;
exports.addImageUploadJob = addImageUploadJob;
exports.addMetadataUploadJob = addMetadataUploadJob;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
/**
 * Queue for IPFS upload operations
 */
exports.ipfsQueue = new bullmq_1.Queue("ipfs-upload", {
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
 * Add image upload job to queue
 */
async function addImageUploadJob(filePath, originalName) {
    const job = await exports.ipfsQueue.add("upload-image", {
        type: "image",
        filePath,
        originalName,
    });
    return job.id;
}
/**
 * Add metadata upload job to queue
 */
async function addMetadataUploadJob(metadata) {
    const job = await exports.ipfsQueue.add("upload-metadata", {
        type: "metadata",
        metadata,
    });
    return job.id;
}
exports.default = exports.ipfsQueue;
//# sourceMappingURL=ipfsQueue.js.map
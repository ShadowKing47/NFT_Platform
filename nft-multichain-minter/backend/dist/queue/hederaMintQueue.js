"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hederaMintQueue = void 0;
exports.addHederaMintJob = addHederaMintJob;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
/**
 * Queue for Hedera NFT minting operations
 */
exports.hederaMintQueue = new bullmq_1.Queue("hederaMintQueue", {
    connection: redis_1.redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
    },
});
/**
 * Add Hedera mint job to queue
 */
async function addHederaMintJob(userAccountId, metadataIpfsUri, name, description) {
    const job = await exports.hederaMintQueue.add("mint-nft", {
        userAccountId,
        metadataIpfsUri,
        name,
        description,
    });
    return job.id;
}
exports.default = exports.hederaMintQueue;
//# sourceMappingURL=hederaMintQueue.js.map
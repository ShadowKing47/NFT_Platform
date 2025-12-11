"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataQueue = void 0;
exports.addMetadataBuildJob = addMetadataBuildJob;
exports.addEthereumMetadataJob = addEthereumMetadataJob;
exports.addHederaMetadataJob = addHederaMetadataJob;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
/**
 * Queue for metadata building operations
 */
exports.metadataQueue = new bullmq_1.Queue("metadata-build", {
    connection: redis_1.redisConnection,
    defaultJobOptions: {
        attempts: 2,
        backoff: {
            type: "fixed",
            delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
    },
});
/**
 * Add metadata build job to queue
 */
async function addMetadataBuildJob(params) {
    const job = await exports.metadataQueue.add("build-metadata", params);
    return job.id;
}
/**
 * Add Ethereum metadata build job
 */
async function addEthereumMetadataJob(name, description, imageIpfsUri, creatorWallet, attributes, externalUrl) {
    return addMetadataBuildJob({
        chain: "ethereum",
        name,
        description,
        imageIpfsUri,
        creatorWallet,
        attributes,
        externalUrl,
    });
}
/**
 * Add Hedera metadata build job
 */
async function addHederaMetadataJob(name, description, imageIpfsUri, userAccountId, attributes) {
    return addMetadataBuildJob({
        chain: "hedera",
        name,
        description,
        imageIpfsUri,
        userAccountId,
        attributes,
    });
}
exports.default = exports.metadataQueue;
//# sourceMappingURL=metadataQueue.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const logger_1 = __importDefault(require("../../utils/logger"));
const metadata_1 = require("../../chains/ethereum/metadata");
const ipfs_1 = require("../../chains/ethereum/ipfs");
const metadata_2 = require("../../chains/hedera/metadata");
const ipfs_2 = require("../../chains/hedera/ipfs");
const sanitization_1 = require("../../utils/sanitization");
exports.metadataWorker = new bullmq_1.Worker("metadataQueue", async (job) => {
    logger_1.default.info({ jobId: job.id }, "Processing metadata creation job");
    try {
        const { name, description, imageIpfsUri, chain, attributes, creatorWallet } = job.data;
        // Sanitize metadata inputs
        const sanitized = (0, sanitization_1.sanitizeMetadata)({ name, description, attributes });
        let metadataUri;
        if (chain === "ethereum") {
            const metadata = (0, metadata_1.buildErc721Metadata)({
                name: sanitized.name,
                description: sanitized.description,
                imageIpfsUri,
                creatorWallet,
                attributes: sanitized.attributes,
                externalUrl: undefined,
            });
            metadataUri = await (0, ipfs_1.uploadMetadataToIpfs)(metadata);
            logger_1.default.info({ jobId: job.id, chain: "ethereum", metadataUri }, "Ethereum metadata created");
        }
        else if (chain === "hedera") {
            const metadata = (0, metadata_2.buildHederaMetadata)({
                name: sanitized.name,
                description: sanitized.description,
                imageIpfsUri,
                creatorWallet,
                attributes: sanitized.attributes,
            });
            metadataUri = await (0, ipfs_2.uploadMetadataToIpfs)(metadata);
            logger_1.default.info({ jobId: job.id, chain: "hedera", metadataUri }, "Hedera metadata created");
        }
        else {
            throw new Error(`Unsupported chain: ${chain}`);
        }
        return { success: true, metadataUri };
    }
    catch (error) {
        logger_1.default.error({ jobId: job.id, error: error.message }, "Metadata creation job failed");
        throw error;
    }
}, { connection: redis_1.redisConnection });
exports.metadataWorker.on("completed", (job) => {
    logger_1.default.info({ jobId: job.id }, "Metadata worker completed job");
});
exports.metadataWorker.on("failed", (job, err) => {
    logger_1.default.error({ jobId: job?.id, error: err.message }, "Metadata worker job failed");
});
//# sourceMappingURL=metadataWorker.js.map
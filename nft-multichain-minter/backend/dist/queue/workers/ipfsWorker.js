"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipfsWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const logger_1 = __importDefault(require("../../utils/logger"));
const ipfs_1 = require("../../chains/ethereum/ipfs");
const ipfs_2 = require("../../chains/hedera/ipfs");
exports.ipfsWorker = new bullmq_1.Worker("ipfsQueue", async (job) => {
    logger_1.default.info({ jobId: job.id }, "Processing IPFS upload job");
    try {
        const { filePath, chain } = job.data;
        // Select appropriate upload function based on chain
        let ipfsUri;
        if (chain === "ethereum") {
            ipfsUri = await (0, ipfs_1.uploadImageToIpfs)(filePath);
            logger_1.default.info({ jobId: job.id, chain: "ethereum", ipfsUri }, "Ethereum IPFS upload completed");
        }
        else if (chain === "hedera") {
            ipfsUri = await (0, ipfs_2.uploadImageToIpfs)(filePath);
            logger_1.default.info({ jobId: job.id, chain: "hedera", ipfsUri }, "Hedera IPFS upload completed");
        }
        else {
            throw new Error(`Unsupported chain: ${chain}`);
        }
        return { success: true, ipfsUri };
    }
    catch (error) {
        logger_1.default.error({ jobId: job.id, error: error.message }, "IPFS upload job failed");
        throw error;
    }
}, { connection: redis_1.redisConnection });
exports.ipfsWorker.on("completed", (job) => {
    logger_1.default.info({ jobId: job.id }, "IPFS worker completed job");
});
exports.ipfsWorker.on("failed", (job, err) => {
    logger_1.default.error({ jobId: job?.id, error: err.message }, "IPFS worker job failed");
});
//# sourceMappingURL=ipfsWorker.js.map
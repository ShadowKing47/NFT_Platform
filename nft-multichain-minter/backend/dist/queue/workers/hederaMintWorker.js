"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hederaMintWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const logger_1 = __importDefault(require("../../utils/logger"));
const mint_1 = require("../../chains/hedera/mint");
const validation_1 = require("../../utils/validation");
exports.hederaMintWorker = new bullmq_1.Worker("hederaMintQueue", async (job) => {
    logger_1.default.info({ jobId: job.id }, "Processing Hedera mint job");
    try {
        const { userAccountId, metadataIpfsUri } = job.data;
        // Validate Hedera account ID
        if (!(0, validation_1.isValidHederaAccountId)(userAccountId)) {
            throw new Error(`Invalid Hedera account ID format: ${userAccountId}`);
        }
        const normalizedAccountId = (0, validation_1.normalizeHederaAccountId)(userAccountId);
        // Execute actual mint operation
        const result = await (0, mint_1.mintHederaNftToUser)({
            userAccountId: normalizedAccountId,
            metadataIpfsUri,
        });
        logger_1.default.info({
            jobId: job.id,
            tokenId: result.tokenId,
            serialNumber: result.serialNumber,
        }, "Hedera mint job completed successfully");
        return {
            success: true,
            tokenId: result.tokenId,
            serialNumber: result.serialNumber,
        };
    }
    catch (error) {
        logger_1.default.error({ jobId: job.id, error: error.message }, "Hedera mint job failed");
        throw error;
    }
}, { connection: redis_1.redisConnection });
exports.hederaMintWorker.on("completed", (job) => {
    logger_1.default.info({ jobId: job.id }, "Hedera mint worker completed job");
});
exports.hederaMintWorker.on("failed", (job, err) => {
    logger_1.default.error({ jobId: job?.id, error: err.message }, "Hedera mint worker job failed");
});
//# sourceMappingURL=hederaMintWorker.js.map
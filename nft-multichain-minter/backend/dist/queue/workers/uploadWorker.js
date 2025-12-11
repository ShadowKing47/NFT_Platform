"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const logger_1 = __importDefault(require("../../utils/logger"));
const sanitization_1 = require("../../utils/sanitization");
const promises_1 = __importDefault(require("fs/promises"));
exports.uploadWorker = new bullmq_1.Worker("uploadQueue", async (job) => {
    logger_1.default.info({ jobId: job.id }, "Processing upload job");
    try {
        const { filePath, walletAddress, originalName } = job.data;
        // Sanitize filename to prevent directory traversal
        const sanitizedName = (0, sanitization_1.sanitizeFilename)(originalName || "upload");
        // Verify file exists
        await promises_1.default.access(filePath);
        logger_1.default.info({ filePath, walletAddress, sanitizedName }, "Upload job processed successfully");
        return {
            success: true,
            filePath,
            sanitizedFilename: sanitizedName,
        };
    }
    catch (error) {
        logger_1.default.error({ jobId: job.id, error: error.message }, "Upload job failed");
        throw error;
    }
}, { connection: redis_1.redisConnection });
exports.uploadWorker.on("completed", (job) => {
    logger_1.default.info({ jobId: job.id }, "Upload worker completed job");
});
exports.uploadWorker.on("failed", (job, err) => {
    logger_1.default.error({ jobId: job?.id, error: err.message }, "Upload worker job failed");
});
//# sourceMappingURL=uploadWorker.js.map
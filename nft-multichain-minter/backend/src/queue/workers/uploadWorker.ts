import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import logger from "../../utils/logger";
import { sanitizeFilename } from "../../utils/sanitization";
import fs from "fs/promises";

export const uploadWorker = new Worker(
  "uploadQueue",
  async (job) => {
    logger.info({ jobId: job.id }, "Processing upload job");

    try {
      const { filePath, walletAddress, originalName } = job.data;

      // Sanitize filename to prevent directory traversal
      const sanitizedName = sanitizeFilename(originalName || "upload");
      
      // Verify file exists
      await fs.access(filePath);
      
      logger.info(
        { filePath, walletAddress, sanitizedName },
        "Upload job processed successfully"
      );

      return {
        success: true,
        filePath,
        sanitizedFilename: sanitizedName,
      };
    } catch (error: any) {
      logger.error({ jobId: job.id, error: error.message }, "Upload job failed");
      throw error;
    }
  },
  { connection: redisConnection }
);

uploadWorker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "Upload worker completed job");
});

uploadWorker.on("failed", (job, err) => {
  logger.error(
    { jobId: job?.id, error: err.message },
    "Upload worker job failed"
  );
});

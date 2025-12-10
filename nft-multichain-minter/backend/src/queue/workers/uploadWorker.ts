import { Worker } from "bullmq";
import { uploadQueue } from "../bullmq";
import { redisConnection } from "../../config/redis";
import logger from "../../utils/logger";

export const uploadWorker = new Worker(
  "uploadQueue",
  async (job) => {
    logger.info({ jobId: job.id }, "Processing upload job");

    try {
      const { filePath, walletAddress } = job.data;

      // TODO: Implement actual upload logic
      // This is a stub for future expansion
      logger.info({ filePath, walletAddress }, "Upload job data received");

      logger.info({ jobId: job.id }, "Upload job completed");

      return { success: true, filePath };
    } catch (error) {
      logger.error({ jobId: job.id, error }, "Upload job failed");
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

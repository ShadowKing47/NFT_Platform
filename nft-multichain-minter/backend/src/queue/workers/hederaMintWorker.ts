import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import logger from "../../utils/logger";
import { mintHederaNftToUser } from "../../chains/hedera/mint";
import { isValidHederaAccountId, normalizeHederaAccountId } from "../../utils/validation";

export const hederaMintWorker = new Worker(
  "hederaMintQueue",
  async (job) => {
    logger.info({ jobId: job.id }, "Processing Hedera mint job");

    try {
      const { userAccountId, metadataIpfsUri } = job.data;

      // Validate Hedera account ID
      if (!isValidHederaAccountId(userAccountId)) {
        throw new Error(`Invalid Hedera account ID format: ${userAccountId}`);
      }

      const normalizedAccountId = normalizeHederaAccountId(userAccountId);

      // Execute actual mint operation
      const result = await mintHederaNftToUser({
        userAccountId: normalizedAccountId,
        metadataIpfsUri,
      });

      logger.info(
        {
          jobId: job.id,
          tokenId: result.tokenId,
          serialNumber: result.serialNumber,
        },
        "Hedera mint job completed successfully"
      );

      return {
        success: true,
        tokenId: result.tokenId,
        serialNumber: result.serialNumber,
      };
    } catch (error: any) {
      logger.error({ jobId: job.id, error: error.message }, "Hedera mint job failed");
      throw error;
    }
  },
  { connection: redisConnection }
);

hederaMintWorker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "Hedera mint worker completed job");
});

hederaMintWorker.on("failed", (job, err) => {
  logger.error(
    { jobId: job?.id, error: err.message },
    "Hedera mint worker job failed"
  );
});

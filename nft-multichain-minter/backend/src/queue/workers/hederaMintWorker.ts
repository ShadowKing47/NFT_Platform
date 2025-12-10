import { Worker } from "bullmq";
import { hederaMintQueue } from "../bullmq";
import { redisConnection } from "../../config/redis";
import logger from "../../utils/logger";

export const hederaMintWorker = new Worker(
  "hederaMintQueue",
  async (job) => {
    logger.info({ jobId: job.id }, "Processing Hedera mint job");

    try {
      const { userAccountId, metadataIpfsUri } = job.data;

      // TODO: Call mintHederaNftToUser
      // import { mintHederaNftToUser } from "../../chains/hedera/mint";

      logger.info(
        { userAccountId, metadataIpfsUri },
        "Hedera mint job data received"
      );

      // Stub: const result = await mintHederaNftToUser({ userAccountId, metadataIpfsUri });

      logger.info({ jobId: job.id }, "Hedera mint job completed");

      return {
        success: true,
        tokenId: "0.0.stub",
        serialNumber: 1,
      };
    } catch (error) {
      logger.error({ jobId: job.id, error }, "Hedera mint job failed");
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

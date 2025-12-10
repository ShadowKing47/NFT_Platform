import { Worker } from "bullmq";
import { ipfsQueue } from "../bullmq";
import { redisConnection } from "../../config/redis";
import logger from "../../utils/logger";

export const ipfsWorker = new Worker(
  "ipfsQueue",
  async (job) => {
    logger.info({ jobId: job.id }, "Processing IPFS upload job");

    try {
      const { filePath, chain } = job.data;

      // TODO: Call uploadImageToIpfs based on chain
      // import { uploadImageToIpfs } from "../../chains/ethereum/ipfs";
      // or
      // import { uploadImageToIpfs } from "../../chains/hedera/ipfs";
      
      logger.info({ filePath, chain }, "IPFS upload job data received");

      // Stub: const ipfsUri = await uploadImageToIpfs(filePath);

      logger.info({ jobId: job.id }, "IPFS upload job completed");

      return { success: true, ipfsUri: "ipfs://stub" };
    } catch (error) {
      logger.error({ jobId: job.id, error }, "IPFS upload job failed");
      throw error;
    }
  },
  { connection: redisConnection }
);

ipfsWorker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "IPFS worker completed job");
});

ipfsWorker.on("failed", (job, err) => {
  logger.error(
    { jobId: job?.id, error: err.message },
    "IPFS worker job failed"
  );
});

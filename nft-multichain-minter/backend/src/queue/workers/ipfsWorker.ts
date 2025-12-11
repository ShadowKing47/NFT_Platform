import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import logger from "../../utils/logger";
import { uploadImageToIpfs as uploadImageToIpfsEth } from "../../chains/ethereum/ipfs";
import { uploadImageToIpfs as uploadImageToIpfsHedera } from "../../chains/hedera/ipfs";

export const ipfsWorker = new Worker(
  "ipfsQueue",
  async (job) => {
    logger.info({ jobId: job.id }, "Processing IPFS upload job");

    try {
      const { filePath, chain } = job.data;

      // Select appropriate upload function based on chain
      let ipfsUri: string;
      
      if (chain === "ethereum") {
        ipfsUri = await uploadImageToIpfsEth(filePath);
        logger.info({ jobId: job.id, chain: "ethereum", ipfsUri }, "Ethereum IPFS upload completed");
      } else if (chain === "hedera") {
        ipfsUri = await uploadImageToIpfsHedera(filePath);
        logger.info({ jobId: job.id, chain: "hedera", ipfsUri }, "Hedera IPFS upload completed");
      } else {
        throw new Error(`Unsupported chain: ${chain}`);
      }

      return { success: true, ipfsUri };
    } catch (error: any) {
      logger.error({ jobId: job.id, error: error.message }, "IPFS upload job failed");
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

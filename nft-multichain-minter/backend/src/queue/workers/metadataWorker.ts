import { Worker } from "bullmq";
import { metadataQueue } from "../bullmq";
import { redisConnection } from "../../config/redis";
import logger from "../../utils/logger";

export const metadataWorker = new Worker(
  "metadataQueue",
  async (job) => {
    logger.info({ jobId: job.id }, "Processing metadata creation job");

    try {
      const { name, description, imageIpfsUri, chain, attributes } = job.data;

      // TODO: Build and upload metadata based on chain
      // import { buildErc721Metadata } from "../../chains/ethereum/metadata";
      // import { uploadMetadataToIpfs } from "../../chains/ethereum/ipfs";
      // or
      // import { buildHederaMetadata } from "../../chains/hedera/metadata";
      // import { uploadMetadataToIpfs } from "../../chains/hedera/ipfs";

      logger.info(
        { name, description, imageIpfsUri, chain },
        "Metadata job data received"
      );

      // Stub: const metadata = buildMetadata(...);
      // Stub: const metadataUri = await uploadMetadataToIpfs(metadata);

      logger.info({ jobId: job.id }, "Metadata creation job completed");

      return { success: true, metadataUri: "ipfs://stub-metadata" };
    } catch (error) {
      logger.error({ jobId: job.id, error }, "Metadata creation job failed");
      throw error;
    }
  },
  { connection: redisConnection }
);

metadataWorker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "Metadata worker completed job");
});

metadataWorker.on("failed", (job, err) => {
  logger.error(
    { jobId: job?.id, error: err.message },
    "Metadata worker job failed"
  );
});

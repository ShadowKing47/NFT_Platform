import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import logger from "../../utils/logger";
import { buildErc721Metadata } from "../../chains/ethereum/metadata";
import { uploadMetadataToIpfs as uploadMetadataToIpfsEth } from "../../chains/ethereum/ipfs";
import { buildHederaMetadata } from "../../chains/hedera/metadata";
import { uploadMetadataToIpfs as uploadMetadataToIpfsHedera } from "../../chains/hedera/ipfs";
import { sanitizeMetadata } from "../../utils/sanitization";

export const metadataWorker = new Worker(
  "metadataQueue",
  async (job) => {
    logger.info({ jobId: job.id }, "Processing metadata creation job");

    try {
      const { name, description, imageIpfsUri, chain, attributes, creatorWallet } = job.data;

      // Sanitize metadata inputs
      const sanitized = sanitizeMetadata({ name, description, attributes });

      let metadataUri: string;

      if (chain === "ethereum") {
        const metadata = buildErc721Metadata({
          name: sanitized.name,
          description: sanitized.description,
          imageIpfsUri,
          creatorWallet,
          attributes: sanitized.attributes,
          externalUrl: undefined,
        });
        metadataUri = await uploadMetadataToIpfsEth(metadata);
        logger.info({ jobId: job.id, chain: "ethereum", metadataUri }, "Ethereum metadata created");
      } else if (chain === "hedera") {
        const metadata = buildHederaMetadata({
          name: sanitized.name,
          description: sanitized.description,
          imageIpfsUri,
          creatorWallet,
          attributes: sanitized.attributes,
        });
        metadataUri = await uploadMetadataToIpfsHedera(metadata);
        logger.info({ jobId: job.id, chain: "hedera", metadataUri }, "Hedera metadata created");
      } else {
        throw new Error(`Unsupported chain: ${chain}`);
      }

      return { success: true, metadataUri };
    } catch (error: any) {
      logger.error({ jobId: job.id, error: error.message }, "Metadata creation job failed");
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

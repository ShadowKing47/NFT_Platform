import logger from "../../utils/logger";
import { uploadWorker } from "./uploadWorker";
import { ipfsWorker } from "./ipfsWorker";
import { metadataWorker } from "./metadataWorker";
import { hederaMintWorker } from "./hederaMintWorker";

export function startWorkers() {
  logger.info("Starting queue workers...");

  // Workers are automatically started when imported
  // This function can be called to initialize all workers

  logger.info("All queue workers started");
}

export function stopWorkers() {
  logger.info("Stopping queue workers...");

  return Promise.all([
    uploadWorker.close(),
    ipfsWorker.close(),
    metadataWorker.close(),
    hederaMintWorker.close(),
  ]);
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, closing workers...");
  await stopWorkers();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, closing workers...");
  await stopWorkers();
  process.exit(0);
});

export { uploadWorker, ipfsWorker, metadataWorker, hederaMintWorker };

import dotenv from "dotenv";
import logger from "./utils/logger";
import { startWorkers, stopWorkers } from "./queue/workers";

// Load environment variables
dotenv.config();

// Start the workers
logger.info("Starting background worker process...");
startWorkers();

// Graceful shutdown handlers
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down worker process...");
  await stopWorkers();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down worker process...");
  await stopWorkers();
  process.exit(0);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error({ reason, promise }, "Unhandled Rejection in worker process");
});

process.on("uncaughtException", (error) => {
  logger.error({ error }, "Uncaught Exception in worker process");
  process.exit(1);
});

logger.info("Worker process is running and processing queue jobs");

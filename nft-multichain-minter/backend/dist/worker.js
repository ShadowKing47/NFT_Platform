"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./utils/logger"));
const workers_1 = require("./queue/workers");
// Load environment variables
dotenv_1.default.config();
// Start the workers
logger_1.default.info("Starting background worker process...");
(0, workers_1.startWorkers)();
// Graceful shutdown handlers
process.on("SIGTERM", async () => {
    logger_1.default.info("SIGTERM received, shutting down worker process...");
    await (0, workers_1.stopWorkers)();
    process.exit(0);
});
process.on("SIGINT", async () => {
    logger_1.default.info("SIGINT received, shutting down worker process...");
    await (0, workers_1.stopWorkers)();
    process.exit(0);
});
process.on("unhandledRejection", (reason, promise) => {
    logger_1.default.error({ reason, promise }, "Unhandled Rejection in worker process");
});
process.on("uncaughtException", (error) => {
    logger_1.default.error({ error }, "Uncaught Exception in worker process");
    process.exit(1);
});
logger_1.default.info("Worker process is running and processing queue jobs");
//# sourceMappingURL=worker.js.map
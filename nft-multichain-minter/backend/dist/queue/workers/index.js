"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hederaMintWorker = exports.metadataWorker = exports.ipfsWorker = exports.uploadWorker = void 0;
exports.startWorkers = startWorkers;
exports.stopWorkers = stopWorkers;
const logger_1 = __importDefault(require("../../utils/logger"));
const uploadWorker_1 = require("./uploadWorker");
Object.defineProperty(exports, "uploadWorker", { enumerable: true, get: function () { return uploadWorker_1.uploadWorker; } });
const ipfsWorker_1 = require("./ipfsWorker");
Object.defineProperty(exports, "ipfsWorker", { enumerable: true, get: function () { return ipfsWorker_1.ipfsWorker; } });
const metadataWorker_1 = require("./metadataWorker");
Object.defineProperty(exports, "metadataWorker", { enumerable: true, get: function () { return metadataWorker_1.metadataWorker; } });
const hederaMintWorker_1 = require("./hederaMintWorker");
Object.defineProperty(exports, "hederaMintWorker", { enumerable: true, get: function () { return hederaMintWorker_1.hederaMintWorker; } });
function startWorkers() {
    logger_1.default.info("Starting queue workers...");
    // Workers are automatically started when imported
    // This function can be called to initialize all workers
    logger_1.default.info("All queue workers started");
}
function stopWorkers() {
    logger_1.default.info("Stopping queue workers...");
    return Promise.all([
        uploadWorker_1.uploadWorker.close(),
        ipfsWorker_1.ipfsWorker.close(),
        metadataWorker_1.metadataWorker.close(),
        hederaMintWorker_1.hederaMintWorker.close(),
    ]);
}
// Graceful shutdown
process.on("SIGTERM", async () => {
    logger_1.default.info("SIGTERM received, closing workers...");
    await stopWorkers();
    process.exit(0);
});
process.on("SIGINT", async () => {
    logger_1.default.info("SIGINT received, closing workers...");
    await stopWorkers();
    process.exit(0);
});
//# sourceMappingURL=index.js.map
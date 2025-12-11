"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMintOperation = logMintOperation;
exports.logAuthEvent = logAuthEvent;
const logger_1 = __importDefault(require("./logger"));
/**
 * Log mint operation for audit trail
 * In production, this should write to a database (MongoDB/Postgres)
 */
function logMintOperation(entry) {
    logger_1.default.info({
        audit: true,
        requestId: entry.requestId,
        wallet: entry.walletAddress,
        chain: entry.chain,
        metadataUri: entry.metadataIpfsUri,
        imageUri: entry.imageIpfsUri,
        tokenId: entry.tokenId,
        serialNumber: entry.serialNumber,
        status: entry.status,
        error: entry.error,
        timestamp: entry.timestamp.toISOString(),
    }, "Mint operation audit log");
    // TODO: In production, write to database:
    // await MintAuditModel.create(entry);
}
/**
 * Log authentication event
 */
function logAuthEvent(requestId, wallet, event, success, error) {
    logger_1.default.info({
        audit: true,
        requestId,
        wallet,
        event,
        success,
        error,
        timestamp: new Date().toISOString(),
    }, "Authentication audit log");
}
//# sourceMappingURL=auditLog.js.map
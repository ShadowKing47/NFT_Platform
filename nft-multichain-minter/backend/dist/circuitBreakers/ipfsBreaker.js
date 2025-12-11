"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipfsBreaker = void 0;
exports.safeIpfsCall = safeIpfsCall;
exports.safeIpfsCallWithArgs = safeIpfsCallWithArgs;
const opossum_1 = __importDefault(require("opossum"));
/**
 * IPFS Upload Circuit Breaker
 * Protects backend from IPFS gateway/upload failures
 * Prevents slowdowns when NFT.Storage or IPFS gateways become unresponsive
 */
/**
 * Base function for IPFS operations
 */
async function ipfsUpload(fn, ...args) {
    return fn(...args);
}
/**
 * Circuit breaker configuration for IPFS operations
 * IPFS uploads can be slow, so timeout is higher
 */
exports.ipfsBreaker = new opossum_1.default(ipfsUpload, {
    timeout: 10000, // 10 seconds for IPFS operations
    errorThresholdPercentage: 50, // Open circuit if 50% of calls fail
    resetTimeout: 30000, // Wait 30 seconds before retry
    volumeThreshold: 5, // Minimum calls before calculating error rate
});
/**
 * Helper function to wrap IPFS operations
 *
 * Usage:
 *   const cid = await safeIpfsCall(() => uploadImageToIpfs(filePath));
 *   const metadataCid = await safeIpfsCall(() => uploadMetadataToIpfs(metadata));
 */
async function safeIpfsCall(fn) {
    return exports.ipfsBreaker.fire(fn);
}
/**
 * Alternative method for calls with parameters
 */
async function safeIpfsCallWithArgs(fn, ...args) {
    return exports.ipfsBreaker.fire(fn, ...args);
}
// Event listeners
exports.ipfsBreaker.on("open", () => {
    console.warn("⚠️ IPFS circuit breaker OPENED - IPFS service experiencing issues");
});
exports.ipfsBreaker.on("halfOpen", () => {
    console.warn("🔄 IPFS circuit breaker HALF-OPEN - Testing IPFS recovery");
});
exports.ipfsBreaker.on("close", () => {
    console.log("✅ IPFS circuit breaker CLOSED - IPFS service healthy");
});
exports.ipfsBreaker.on("failure", (error) => {
    console.error("❌ IPFS operation failed:", error.message);
});
exports.default = exports.ipfsBreaker;
//# sourceMappingURL=ipfsBreaker.js.map
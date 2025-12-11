"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hederaBreaker = void 0;
exports.safeHederaCall = safeHederaCall;
exports.safeHederaCallWithArgs = safeHederaCallWithArgs;
const opossum_1 = __importDefault(require("opossum"));
/**
 * Hedera Network Circuit Breaker
 * Protects backend from Hedera SDK call failures during network instability
 * Prevents slowdowns from HTS operations (mint, transfer, queries)
 */
/**
 * Wraps Hedera SDK calls (mint, transfer, queries)
 * to provide automatic fallback and protection
 */
async function hederaExecutor(fn, ...args) {
    return fn(...args);
}
/**
 * Circuit breaker configuration:
 * - Hedera operations typically take longer than Ethereum RPC calls
 * - More lenient timeout to account for consensus time
 * - Slightly more sensitive to failures
 */
exports.hederaBreaker = new opossum_1.default(hederaExecutor, {
    timeout: 10000, // 10 seconds - Hedera calls often take longer than ETH
    errorThresholdPercentage: 40, // More sensitive - open at 40% failures
    resetTimeout: 20000, // 20 seconds before retry
    volumeThreshold: 3, // Hedera operations less frequent, lower threshold
});
/**
 * Helper method for safe Hedera operations
 *
 * Usage:
 *   const receipt = await safeHederaCall(async () => {
 *     const tx = await new TokenMintTransaction()
 *       .setTokenId(tokenId)
 *       .addMetadata(metadataBytes)
 *       .execute(client);
 *     return tx.getReceipt(client);
 *   });
 */
async function safeHederaCall(fn) {
    return exports.hederaBreaker.fire(fn);
}
/**
 * Alternative method for calls with parameters
 *
 * Usage:
 *   const info = await safeHederaCallWithArgs(
 *     (tokenId, serial) => new TokenNftInfoQuery()
 *       .setTokenId(tokenId)
 *       .setNftId(serial)
 *       .execute(client),
 *     tokenId,
 *     serialNumber
 *   );
 */
async function safeHederaCallWithArgs(fn, ...args) {
    return exports.hederaBreaker.fire(fn, ...args);
}
// Event listeners for monitoring circuit breaker state
exports.hederaBreaker.on("open", () => {
    console.warn("⚠️ Hedera circuit breaker OPENED - Network experiencing issues");
});
exports.hederaBreaker.on("halfOpen", () => {
    console.warn("🔄 Hedera circuit breaker HALF-OPEN - Testing network recovery");
});
exports.hederaBreaker.on("close", () => {
    console.log("✅ Hedera circuit breaker CLOSED - Network healthy");
});
exports.hederaBreaker.on("failure", (error) => {
    console.error("❌ Hedera operation failed:", error.message);
});
exports.hederaBreaker.on("success", () => {
    // Optionally log successful operations for debugging
    // console.log("✓ Hedera operation succeeded");
});
exports.default = exports.hederaBreaker;
//# sourceMappingURL=hederaBreaker.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hederaWalletLimiter = hederaWalletLimiter;
const redis_1 = __importDefault(require("../config/redis"));
const logger_1 = __importDefault(require("../utils/logger"));
const RATE_LIMIT_WINDOW = 60; // 1 minute in seconds
const MAX_REQUESTS_PER_WALLET = parseInt(process.env.HEDERA_WALLET_RATE_LIMIT || "5", 10);
/**
 * Rate limiter for Hedera wallet operations
 * Limits minting operations per wallet address
 */
async function hederaWalletLimiter(req, res, next) {
    try {
        const walletAddress = req.body.userAccountId || req.body.wallet;
        if (!walletAddress) {
            return next();
        }
        // Normalize Hedera account ID (remove extra spaces, standardize format)
        const normalizedAddress = walletAddress.trim();
        const key = `hedera:ratelimit:${normalizedAddress}`;
        // Get current count
        const current = await redis_1.default.get(key);
        const count = current ? parseInt(current, 10) : 0;
        if (count >= MAX_REQUESTS_PER_WALLET) {
            logger_1.default.warn(`Hedera rate limit exceeded for wallet: ${walletAddress}`);
            res.status(429).json({
                error: "Rate limit exceeded",
                message: `Maximum ${MAX_REQUESTS_PER_WALLET} requests per minute allowed`,
                retryAfter: RATE_LIMIT_WINDOW,
            });
            return;
        }
        // Increment counter
        const newCount = count + 1;
        await redis_1.default.set(key, newCount.toString(), "EX", RATE_LIMIT_WINDOW);
        // Add rate limit headers
        res.setHeader("X-RateLimit-Limit", MAX_REQUESTS_PER_WALLET);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS_PER_WALLET - newCount));
        res.setHeader("X-RateLimit-Reset", Date.now() + RATE_LIMIT_WINDOW * 1000);
        next();
    }
    catch (error) {
        logger_1.default.error({ err: error }, "Hedera wallet rate limiter error");
        next(); // Fail open on error
    }
}
exports.default = hederaWalletLimiter;
//# sourceMappingURL=hederaWalletLimiter.js.map
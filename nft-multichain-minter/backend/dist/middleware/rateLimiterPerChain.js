"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiterPerChain = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const logger_1 = __importDefault(require("../utils/logger"));
const RATE_LIMITS = {
    ethereum: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 3,
    },
    hedera: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 5,
    },
};
const rateLimiterPerChain = (chain) => {
    return async (req, res, next) => {
        try {
            const wallet = req.wallet;
            if (!wallet) {
                return res.status(401).json({ error: "Wallet not identified" });
            }
            const config = RATE_LIMITS[chain];
            const key = `ratelimit:${chain}:${wallet}`;
            const current = await redis_1.default.incr(key);
            if (current === 1) {
                await redis_1.default.pexpire(key, config.windowMs);
            }
            if (current > config.maxRequests) {
                logger_1.default.warn(`Rate limit exceeded for ${wallet} on ${chain}`);
                return res.status(429).json({
                    error: `Rate limit exceeded. Max ${config.maxRequests} requests per minute for ${chain}.`,
                });
            }
            return next();
        }
        catch (err) {
            logger_1.default.error({ err }, "Rate limiter error");
            next();
        }
    };
};
exports.rateLimiterPerChain = rateLimiterPerChain;
//# sourceMappingURL=rateLimiterPerChain.js.map
import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";
import logger from "../utils/logger";

const RATE_LIMIT_WINDOW = 60; // 1 minute in seconds
const MAX_REQUESTS_PER_WALLET = parseInt(process.env.ETH_WALLET_RATE_LIMIT || "10", 10);

/**
 * Rate limiter for Ethereum wallet operations
 * Limits minting operations per wallet address
 */
export async function ethWalletLimiter(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const walletAddress = req.body.walletAddress || req.body.wallet;
        
        if (!walletAddress) {
            return next();
        }
        
        const key = `eth:ratelimit:${walletAddress.toLowerCase()}`;
        
        // Get current count
        const current = await redisClient.get(key);
        const count = current ? parseInt(current, 10) : 0;
        
        if (count >= MAX_REQUESTS_PER_WALLET) {
            logger.warn(`Ethereum rate limit exceeded for wallet: ${walletAddress}`);
            res.status(429).json({
                error: "Rate limit exceeded",
                message: `Maximum ${MAX_REQUESTS_PER_WALLET} requests per minute allowed`,
                retryAfter: RATE_LIMIT_WINDOW,
            });
            return;
        }
        
        // Increment counter
        const newCount = count + 1;
        await redisClient.set(key, newCount.toString(), "EX", RATE_LIMIT_WINDOW);
        
        // Add rate limit headers
        res.setHeader("X-RateLimit-Limit", MAX_REQUESTS_PER_WALLET);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS_PER_WALLET - newCount));
        res.setHeader("X-RateLimit-Reset", Date.now() + RATE_LIMIT_WINDOW * 1000);
        
        next();
    } catch (error) {
        logger.error("Ethereum wallet rate limiter error:", error);
        next(); // Fail open on error
    }
}

export default ethWalletLimiter;

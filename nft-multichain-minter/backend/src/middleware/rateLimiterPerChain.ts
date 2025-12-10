import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";
import logger from "../utils/logger";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  ethereum: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3,
  },
  hedera: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
  },
};

export const rateLimiterPerChain = (chain: "ethereum" | "hedera") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallet = (req as any).wallet;

      if (!wallet) {
        return res.status(401).json({ error: "Wallet not identified" });
      }

      const config = RATE_LIMITS[chain];
      const key = `ratelimit:${chain}:${wallet}`;

      const current = await redisClient.incr(key);

      if (current === 1) {
        await redisClient.pexpire(key, config.windowMs);
      }

      if (current > config.maxRequests) {
        logger.warn(`Rate limit exceeded for ${wallet} on ${chain}`);
        return res.status(429).json({
          error: `Rate limit exceeded. Max ${config.maxRequests} requests per minute for ${chain}.`,
        });
      }

      next();
    } catch (err) {
      logger.error({ err }, "Rate limiter error");
      next();
    }
  };
};

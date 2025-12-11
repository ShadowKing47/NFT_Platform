import { Router, Request, Response } from "express";
import redisClient from "../config/redis";

const router = Router();

/**
 * Health check endpoint
 * Returns system status and uptime
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        // Check Redis connection
        let redisStatus = "disconnected";
        try {
            await redisClient.ping();
            redisStatus = "connected";
        } catch (error) {
            console.error("Redis health check failed:", error);
        }
        
        res.json({
            status: "ok",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            services: {
                redis: redisStatus,
            },
            version: process.env.npm_package_version || "unknown",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: "Health check failed",
        });
    }
});

export default router;

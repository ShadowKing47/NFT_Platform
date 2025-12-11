"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const redis_1 = __importDefault(require("../config/redis"));
const router = (0, express_1.Router)();
/**
 * Health check endpoint
 * Returns system status and uptime
 */
router.get("/", async (_req, res) => {
    try {
        // Check Redis connection
        let redisStatus = "disconnected";
        try {
            await redis_1.default.ping();
            redisStatus = "connected";
        }
        catch (error) {
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
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            error: "Health check failed",
        });
    }
});
exports.default = router;
//# sourceMappingURL=health.js.map
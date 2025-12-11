import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import config from "./config/env";
import ethRoutes from "./routes/ethereum";
import hederaRoutes from "./routes/hedera";
import nftRoutes from "./routes/nft";
import nonceRoutes from "./routes/auth/nonce";
import authRoutes from "./routes/auth/verify";
import healthRoutes from "./routes/health";
import { jwtMiddleware } from "./auth/jwtMiddleware";
import globalLimiter from "./rateLimiters/globalLimiter";
import { errorHandler } from "./utils/errors";
import { requestIdMiddleware } from "./middleware/requestId";
import logger from "./utils/logger";

const app = express();

// Request ID middleware - must be first
app.use(requestIdMiddleware);

// CORS configuration - strict origin restrictions
const allowedOrigins =
    config.nodeEnv === "production"
        ? [process.env.FRONTEND_URL || "https://yourdomain.com"]
        : ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn({ origin }, "CORS request from unauthorized origin");
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(globalLimiter);

// Auth
app.use("/api/auth/nonce", nonceRoutes);
app.use("/api/auth/verify", authRoutes);

// Chain routes - protected with JWT
app.use("/api/eth", jwtMiddleware, ethRoutes);
app.use("/api/hedera", jwtMiddleware, hederaRoutes);

// NFT details routes - public
app.use("/api/nft", nftRoutes);

// Health check
app.use("/api/health", healthRoutes);

app.use(errorHandler);

export default app;
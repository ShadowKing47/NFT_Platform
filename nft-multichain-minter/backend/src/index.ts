import express from "express";
import cors from "cors";
import helmet from "helmet";
import ethRoutes from "./routes/ethereum";
import hederaRoutes from "./routes/hedera";
import nftRoutes from "./routes/nft";
import nonceRoutes from "./routes/auth/nonce";
import authRoutes from "./routes/auth/verify";
import healthRoutes from "./routes/health";
import { jwtMiddleware } from "./auth/jwtMiddleware";
import globalLimiter from "./rateLimiters/globalLimiter";
import { errorHandler } from "./utils/errors";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
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
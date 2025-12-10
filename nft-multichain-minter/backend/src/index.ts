import express from "express";
import cors from "cors";
import ethRoutes from "./routes/ethereum";
import hederaRoutes from "./routes/hedera";
import nftRoutes from "./routes/nft";
import { jwtMiddleware } from "./auth/jwtMiddleware";

// ...


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

// Health
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

export default app;
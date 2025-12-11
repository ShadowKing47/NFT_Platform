"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = __importDefault(require("./config/env"));
const ethereum_1 = __importDefault(require("./routes/ethereum"));
const hedera_1 = __importDefault(require("./routes/hedera"));
const nft_1 = __importDefault(require("./routes/nft"));
const nonce_1 = __importDefault(require("./routes/auth/nonce"));
const verify_1 = __importDefault(require("./routes/auth/verify"));
const health_1 = __importDefault(require("./routes/health"));
const jwtMiddleware_1 = require("./auth/jwtMiddleware");
const globalLimiter_1 = __importDefault(require("./rateLimiters/globalLimiter"));
const errors_1 = require("./utils/errors");
const requestId_1 = require("./middleware/requestId");
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
// Request ID middleware - must be first
app.use(requestId_1.requestIdMiddleware);
// CORS configuration - strict origin restrictions
const allowedOrigins = env_1.default.nodeEnv === "production"
    ? [process.env.FRONTEND_URL || "https://yourdomain.com"]
    : ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            logger_1.default.warn({ origin }, "CORS request from unauthorized origin");
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(globalLimiter_1.default);
// Auth
app.use("/api/auth/nonce", nonce_1.default);
app.use("/api/auth/verify", verify_1.default);
// Chain routes - protected with JWT
app.use("/api/eth", jwtMiddleware_1.jwtMiddleware, ethereum_1.default);
app.use("/api/hedera", jwtMiddleware_1.jwtMiddleware, hedera_1.default);
// NFT details routes - public
app.use("/api/nft", nft_1.default);
// Health check
app.use("/api/health", health_1.default);
app.use(errors_1.errorHandler);
exports.default = app;
//# sourceMappingURL=index.js.map
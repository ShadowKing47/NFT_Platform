import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export interface AppConfig {
    // Server
    port: number;
    nodeEnv: string;
    
    // Ethereum
    ethRpcUrl: string;
    ethContractAddress: string;
    ethNetwork: string;
    
    // Hedera
    hederaOperatorId: string;
    hederaOperatorKey: string;
    hederaNftTokenId: string;
    hederaNetwork: string;
    
    // Authentication
    jwtSecret: string;
    jwtExpiresIn: string;
    
    // Redis
    redisUrl: string;
    
    // IPFS/Storage
    nftStorageApiKey: string;
    
    // Rate limiting
    globalRateLimit: number;
    walletRateLimit: number;
}

/**
 * Load and validate environment configuration
 */
function loadConfig(): AppConfig {
    const config: AppConfig = {
        // Server
        port: parseInt(process.env.PORT || "8000", 10),
        nodeEnv: process.env.NODE_ENV || "development",
        
        // Ethereum
        ethRpcUrl: process.env.ETH_RPC_URL || "",
        ethContractAddress: process.env.ETH_CONTRACT_ADDRESS || "",
        ethNetwork: process.env.ETH_NETWORK || "sepolia",
        
        // Hedera
        hederaOperatorId: process.env.HEDERA_OPERATOR_ID || "",
        hederaOperatorKey: process.env.HEDERA_OPERATOR_KEY || "",
        hederaNftTokenId: process.env.HEDERA_NFT_TOKEN_ID || "",
        hederaNetwork: process.env.HEDERA_NETWORK || "testnet",
        
        // Authentication
        jwtSecret: process.env.JWT_SECRET || "",
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || "2h",
        
        // Redis
        redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
        
        // IPFS/Storage
        nftStorageApiKey: process.env.NFT_STORAGE_API_KEY || "",
        
        // Rate limiting
        globalRateLimit: parseInt(process.env.GLOBAL_RATE_LIMIT || "100", 10),
        walletRateLimit: parseInt(process.env.WALLET_RATE_LIMIT || "10", 10),
    };
    
    return config;
}

/**
 * Validate required environment variables
 */
export function validateConfig(config: AppConfig): void {
    const errors: string[] = [];
    
    // Critical validations
    if (!config.nftStorageApiKey) {
        if (config.nodeEnv === "production") {
            errors.push("NFT_STORAGE_API_KEY is required in production");
        } else {
            console.warn("NFT_STORAGE_API_KEY not set - IPFS uploads will not work");
        }
    }
    
    if (!config.ethRpcUrl) {
        console.warn("ETH_RPC_URL not set - Ethereum minting will not work");
    }
    
    if (!config.ethContractAddress) {
        console.warn("ETH_CONTRACT_ADDRESS not set - Ethereum minting will not work");
    }
    
    if (!config.hederaOperatorId || !config.hederaOperatorKey) {
        console.warn("Hedera operator credentials not set - Hedera minting will not work");
    }
    
    if (!config.redisUrl) {
        errors.push("REDIS_URL is required");
    }
    
    // Strict JWT secret validation
    if (!config.jwtSecret) {
        errors.push("JWT_SECRET is required and must be set");
    } else if (config.jwtSecret.length < 32) {
        errors.push("JWT_SECRET must be at least 32 characters long for security");
    }
    
    if (config.nodeEnv === "production") {
        if (config.jwtSecret.length < 64) {
            console.warn("WARNING: JWT_SECRET should be at least 64 characters in production");
        }
    }
    
    if (errors.length > 0) {
        throw new Error(`Configuration errors:\n${errors.join("\n")}`);
    }
}

// Load and validate configuration
const config = loadConfig();

// Validate in non-test environments
if (process.env.NODE_ENV !== "test") {
    try {
        validateConfig(config);
    } catch (error: any) {
        console.error("Configuration validation failed:", error.message);
        process.exit(1);
    }
}

export default config;

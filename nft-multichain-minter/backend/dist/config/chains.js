"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETHEREUM_CONFIG = exports.HEDERA_CONFIG = exports.CHAIN_CONFIGS = exports.SUPPORTED_CHAINS = void 0;
exports.isSupportedChain = isSupportedChain;
exports.getChainConfig = getChainConfig;
exports.validateChainConfig = validateChainConfig;
exports.SUPPORTED_CHAINS = ["ethereum", "hedera"];
exports.CHAIN_CONFIGS = {
    ethereum: {
        name: "Ethereum",
        network: process.env.ETH_NETWORK || "sepolia",
        rpcUrl: process.env.ETH_RPC_URL,
        explorerUrl: process.env.ETH_NETWORK === "mainnet"
            ? "https://etherscan.io"
            : "https://sepolia.etherscan.io",
    },
    hedera: {
        name: "Hedera",
        network: process.env.HEDERA_NETWORK || "testnet",
        explorerUrl: process.env.HEDERA_NETWORK === "mainnet"
            ? "https://hashscan.io/mainnet"
            : "https://hashscan.io/testnet",
    },
};
exports.HEDERA_CONFIG = {
    tokenId: process.env.HEDERA_NFT_TOKEN_ID || "",
    operatorId: process.env.HEDERA_OPERATOR_ID || "",
    operatorKey: process.env.HEDERA_OPERATOR_KEY || "",
    network: process.env.HEDERA_NETWORK || "testnet",
};
exports.ETHEREUM_CONFIG = {
    contractAddress: process.env.ETH_CONTRACT_ADDRESS || "",
    rpcUrl: process.env.ETH_RPC_URL || "",
    network: process.env.ETH_NETWORK || "sepolia",
};
/**
 * Check if a chain is supported
 */
function isSupportedChain(chain) {
    return exports.SUPPORTED_CHAINS.includes(chain);
}
/**
 * Get chain configuration
 */
function getChainConfig(chain) {
    return exports.CHAIN_CONFIGS[chain];
}
/**
 * Validate chain-specific configuration
 */
function validateChainConfig(chain) {
    if (chain === "ethereum") {
        if (!exports.ETHEREUM_CONFIG.contractAddress) {
            throw new Error("ETH_CONTRACT_ADDRESS is not configured");
        }
        if (!exports.ETHEREUM_CONFIG.rpcUrl) {
            throw new Error("ETH_RPC_URL is not configured");
        }
    }
    else if (chain === "hedera") {
        if (!exports.HEDERA_CONFIG.tokenId) {
            console.warn("HEDERA_NFT_TOKEN_ID is not configured");
        }
        if (!exports.HEDERA_CONFIG.operatorId || !exports.HEDERA_CONFIG.operatorKey) {
            throw new Error("Hedera operator credentials are not configured");
        }
    }
}
//# sourceMappingURL=chains.js.map
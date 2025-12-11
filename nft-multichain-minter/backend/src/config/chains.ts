export type SupportedChain = "ethereum" | "hedera";

export interface ChainConfig {
    name: string;
    network: string;
    rpcUrl?: string;
    explorerUrl: string;
}

export const SUPPORTED_CHAINS: SupportedChain[] = ["ethereum", "hedera"];

export const CHAIN_CONFIGS: Record<SupportedChain, ChainConfig> = {
    ethereum: {
        name: "Ethereum",
        network: process.env.ETH_NETWORK || "sepolia",
        rpcUrl: process.env.ETH_RPC_URL,
        explorerUrl:
            process.env.ETH_NETWORK === "mainnet"
                ? "https://etherscan.io"
                : "https://sepolia.etherscan.io",
    },
    hedera: {
        name: "Hedera",
        network: process.env.HEDERA_NETWORK || "testnet",
        explorerUrl:
            process.env.HEDERA_NETWORK === "mainnet"
                ? "https://hashscan.io/mainnet"
                : "https://hashscan.io/testnet",
    },
};

export const HEDERA_CONFIG = {
    tokenId: process.env.HEDERA_NFT_TOKEN_ID || "",
    operatorId: process.env.HEDERA_OPERATOR_ID || "",
    operatorKey: process.env.HEDERA_OPERATOR_KEY || "",
    network: process.env.HEDERA_NETWORK || "testnet",
};

export const ETHEREUM_CONFIG = {
    contractAddress: process.env.ETH_CONTRACT_ADDRESS || "",
    rpcUrl: process.env.ETH_RPC_URL || "",
    network: process.env.ETH_NETWORK || "sepolia",
};

/**
 * Check if a chain is supported
 */
export function isSupportedChain(chain: string): chain is SupportedChain {
    return SUPPORTED_CHAINS.includes(chain as SupportedChain);
}

/**
 * Get chain configuration
 */
export function getChainConfig(chain: SupportedChain): ChainConfig {
    return CHAIN_CONFIGS[chain];
}

/**
 * Validate chain-specific configuration
 */
export function validateChainConfig(chain: SupportedChain): void {
    if (chain === "ethereum") {
        if (!ETHEREUM_CONFIG.contractAddress) {
            throw new Error("ETH_CONTRACT_ADDRESS is not configured");
        }
        if (!ETHEREUM_CONFIG.rpcUrl) {
            throw new Error("ETH_RPC_URL is not configured");
        }
    } else if (chain === "hedera") {
        if (!HEDERA_CONFIG.tokenId) {
            console.warn("HEDERA_NFT_TOKEN_ID is not configured");
        }
        if (!HEDERA_CONFIG.operatorId || !HEDERA_CONFIG.operatorKey) {
            throw new Error("Hedera operator credentials are not configured");
        }
    }
}

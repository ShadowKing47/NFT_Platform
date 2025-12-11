export type SupportedChain = "ethereum" | "hedera";
export interface ChainConfig {
    name: string;
    network: string;
    rpcUrl?: string;
    explorerUrl: string;
}
export declare const SUPPORTED_CHAINS: SupportedChain[];
export declare const CHAIN_CONFIGS: Record<SupportedChain, ChainConfig>;
export declare const HEDERA_CONFIG: {
    tokenId: string;
    operatorId: string;
    operatorKey: string;
    network: string;
};
export declare const ETHEREUM_CONFIG: {
    contractAddress: string;
    rpcUrl: string;
    network: string;
};
/**
 * Check if a chain is supported
 */
export declare function isSupportedChain(chain: string): chain is SupportedChain;
/**
 * Get chain configuration
 */
export declare function getChainConfig(chain: SupportedChain): ChainConfig;
/**
 * Validate chain-specific configuration
 */
export declare function validateChainConfig(chain: SupportedChain): void;
//# sourceMappingURL=chains.d.ts.map
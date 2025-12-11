export interface AppConfig {
    port: number;
    nodeEnv: string;
    ethRpcUrl: string;
    ethContractAddress: string;
    ethNetwork: string;
    hederaOperatorId: string;
    hederaOperatorKey: string;
    hederaNftTokenId: string;
    hederaNetwork: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    redisUrl: string;
    nftStorageApiKey: string;
    globalRateLimit: number;
    walletRateLimit: number;
}
/**
 * Validate required environment variables
 */
export declare function validateConfig(config: AppConfig): void;
declare const config: AppConfig;
export default config;
//# sourceMappingURL=env.d.ts.map
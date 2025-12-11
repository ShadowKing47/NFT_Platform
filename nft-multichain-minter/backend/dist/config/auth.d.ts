/**
 * Authentication configuration
 */
export declare const AUTH_CONFIG: {
    jwtSecret: string;
    jwtExpiresIn: string;
    nonceExpiry: number;
    ethereumMessageTemplate: (nonce: string) => string;
    hederaMessageTemplate: (nonce: string) => string;
    ethereumPrefix: string;
    hederaPrefix: string;
};
/**
 * Get signature message for authentication
 */
export declare function getSignatureMessage(nonce: string, chain: "ethereum" | "hedera"): string;
/**
 * Validate JWT secret is configured
 */
export declare function validateAuthConfig(): void;
export default AUTH_CONFIG;
//# sourceMappingURL=auth.d.ts.map
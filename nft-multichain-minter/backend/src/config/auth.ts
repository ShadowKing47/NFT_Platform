/**
 * Authentication configuration
 */

export const AUTH_CONFIG = {
    // JWT settings
    jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    
    // Nonce settings
    nonceExpiry: 300, // 5 minutes in seconds
    
    // Signature message templates
    ethereumMessageTemplate: (nonce: string) =>
        `Sign this message to authenticate with NFT Nexus.\n\nNonce: ${nonce}`,
    
    hederaMessageTemplate: (nonce: string) =>
        `Sign this message to authenticate with NFT Nexus.\n\nNonce: ${nonce}`,
    
    // Signature prefixes
    ethereumPrefix: "\x19Ethereum Signed Message:\n",
    hederaPrefix: "Hedera:",
};

/**
 * Get signature message for authentication
 */
export function getSignatureMessage(nonce: string, chain: "ethereum" | "hedera"): string {
    if (chain === "ethereum") {
        return AUTH_CONFIG.ethereumMessageTemplate(nonce);
    }
    return AUTH_CONFIG.hederaMessageTemplate(nonce);
}

/**
 * Validate JWT secret is configured
 */
export function validateAuthConfig(): void {
    if (!process.env.JWT_SECRET) {
        console.warn("JWT_SECRET not set, using default (insecure for production)");
    }
    
    if (AUTH_CONFIG.jwtSecret === "your-secret-key-change-in-production") {
        console.warn("Using default JWT secret - change this in production!");
    }
}

export default AUTH_CONFIG;

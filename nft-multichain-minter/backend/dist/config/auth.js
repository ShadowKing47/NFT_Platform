"use strict";
/**
 * Authentication configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_CONFIG = void 0;
exports.getSignatureMessage = getSignatureMessage;
exports.validateAuthConfig = validateAuthConfig;
exports.AUTH_CONFIG = {
    // JWT settings
    jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    // Nonce settings
    nonceExpiry: 300, // 5 minutes in seconds
    // Signature message templates
    ethereumMessageTemplate: (nonce) => `Sign this message to authenticate with NFT Nexus.\n\nNonce: ${nonce}`,
    hederaMessageTemplate: (nonce) => `Sign this message to authenticate with NFT Nexus.\n\nNonce: ${nonce}`,
    // Signature prefixes
    ethereumPrefix: "\x19Ethereum Signed Message:\n",
    hederaPrefix: "Hedera:",
};
/**
 * Get signature message for authentication
 */
function getSignatureMessage(nonce, chain) {
    if (chain === "ethereum") {
        return exports.AUTH_CONFIG.ethereumMessageTemplate(nonce);
    }
    return exports.AUTH_CONFIG.hederaMessageTemplate(nonce);
}
/**
 * Validate JWT secret is configured
 */
function validateAuthConfig() {
    if (!process.env.JWT_SECRET) {
        console.warn("JWT_SECRET not set, using default (insecure for production)");
    }
    if (exports.AUTH_CONFIG.jwtSecret === "your-secret-key-change-in-production") {
        console.warn("Using default JWT secret - change this in production!");
    }
}
exports.default = exports.AUTH_CONFIG;
//# sourceMappingURL=auth.js.map
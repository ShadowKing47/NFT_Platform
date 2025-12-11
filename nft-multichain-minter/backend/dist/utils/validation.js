"use strict";
/**
 * Validation utilities for addresses and account IDs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEthereumAddress = isValidEthereumAddress;
exports.isValidHederaAccountId = isValidHederaAccountId;
exports.normalizeEthereumAddress = normalizeEthereumAddress;
exports.normalizeHederaAccountId = normalizeHederaAccountId;
/**
 * Strict Ethereum address validation (EVM-compatible)
 * Validates 0x prefix + 40 hex characters
 */
function isValidEthereumAddress(address) {
    if (!address || typeof address !== "string") {
        return false;
    }
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address.trim());
}
/**
 * Hedera account ID validation (shard.realm.num format)
 * Standard format: 0.0.xxxxx
 */
function isValidHederaAccountId(accountId) {
    if (!accountId || typeof accountId !== "string") {
        return false;
    }
    const hederaIdRegex = /^0\.\d+\.\d+$/;
    return hederaIdRegex.test(accountId.trim());
}
/**
 * Normalize Ethereum address to lowercase for consistent comparison
 */
function normalizeEthereumAddress(address) {
    return address.toLowerCase().trim();
}
/**
 * Normalize Hedera account ID by trimming whitespace
 */
function normalizeHederaAccountId(accountId) {
    return accountId.trim();
}
//# sourceMappingURL=validation.js.map
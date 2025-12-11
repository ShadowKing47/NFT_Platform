/**
 * Validation utilities for addresses and account IDs
 */

/**
 * Strict Ethereum address validation (EVM-compatible)
 * Validates 0x prefix + 40 hex characters
 */
export function isValidEthereumAddress(address: string): boolean {
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
export function isValidHederaAccountId(accountId: string): boolean {
    if (!accountId || typeof accountId !== "string") {
        return false;
    }
    const hederaIdRegex = /^0\.\d+\.\d+$/;
    return hederaIdRegex.test(accountId.trim());
}

/**
 * Normalize Ethereum address to lowercase for consistent comparison
 */
export function normalizeEthereumAddress(address: string): string {
    return address.toLowerCase().trim();
}

/**
 * Normalize Hedera account ID by trimming whitespace
 */
export function normalizeHederaAccountId(accountId: string): string {
    return accountId.trim();
}

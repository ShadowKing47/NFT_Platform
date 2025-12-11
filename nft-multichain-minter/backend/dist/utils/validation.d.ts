/**
 * Validation utilities for addresses and account IDs
 */
/**
 * Strict Ethereum address validation (EVM-compatible)
 * Validates 0x prefix + 40 hex characters
 */
export declare function isValidEthereumAddress(address: string): boolean;
/**
 * Hedera account ID validation (shard.realm.num format)
 * Standard format: 0.0.xxxxx
 */
export declare function isValidHederaAccountId(accountId: string): boolean;
/**
 * Normalize Ethereum address to lowercase for consistent comparison
 */
export declare function normalizeEthereumAddress(address: string): string;
/**
 * Normalize Hedera account ID by trimming whitespace
 */
export declare function normalizeHederaAccountId(accountId: string): string;
//# sourceMappingURL=validation.d.ts.map
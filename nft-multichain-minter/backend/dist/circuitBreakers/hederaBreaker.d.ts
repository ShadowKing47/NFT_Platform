import CircuitBreaker from "opossum";
/**
 * Circuit breaker configuration:
 * - Hedera operations typically take longer than Ethereum RPC calls
 * - More lenient timeout to account for consensus time
 * - Slightly more sensitive to failures
 */
export declare const hederaBreaker: CircuitBreaker<[fn: Function, ...args: any[]], any>;
/**
 * Helper method for safe Hedera operations
 *
 * Usage:
 *   const receipt = await safeHederaCall(async () => {
 *     const tx = await new TokenMintTransaction()
 *       .setTokenId(tokenId)
 *       .addMetadata(metadataBytes)
 *       .execute(client);
 *     return tx.getReceipt(client);
 *   });
 */
export declare function safeHederaCall<T>(fn: () => Promise<T>): Promise<T>;
/**
 * Alternative method for calls with parameters
 *
 * Usage:
 *   const info = await safeHederaCallWithArgs(
 *     (tokenId, serial) => new TokenNftInfoQuery()
 *       .setTokenId(tokenId)
 *       .setNftId(serial)
 *       .execute(client),
 *     tokenId,
 *     serialNumber
 *   );
 */
export declare function safeHederaCallWithArgs<T>(fn: Function, ...args: any[]): Promise<T>;
export default hederaBreaker;
//# sourceMappingURL=hederaBreaker.d.ts.map
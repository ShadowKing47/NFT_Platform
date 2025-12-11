import CircuitBreaker from "opossum";
/**
 * Circuit breaker configuration for IPFS operations
 * IPFS uploads can be slow, so timeout is higher
 */
export declare const ipfsBreaker: CircuitBreaker<[fn: Function, ...args: any[]], any>;
/**
 * Helper function to wrap IPFS operations
 *
 * Usage:
 *   const cid = await safeIpfsCall(() => uploadImageToIpfs(filePath));
 *   const metadataCid = await safeIpfsCall(() => uploadMetadataToIpfs(metadata));
 */
export declare function safeIpfsCall<T>(fn: () => Promise<T>): Promise<T>;
/**
 * Alternative method for calls with parameters
 */
export declare function safeIpfsCallWithArgs<T>(fn: Function, ...args: any[]): Promise<T>;
export default ipfsBreaker;
//# sourceMappingURL=ipfsBreaker.d.ts.map
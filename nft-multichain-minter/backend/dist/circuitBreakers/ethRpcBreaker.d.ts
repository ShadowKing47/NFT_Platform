import CircuitBreaker from "opossum";
/**
 * Circuit breaker configuration:
 * - timeout: how long to wait before considering the RPC call failed
 * - errorThresholdPercentage: % of failures before breaker opens
 * - resetTimeout: time before trying again after opening
 */
export declare const ethRpcBreaker: CircuitBreaker<[fn: Function, ...args: any[]], any>;
/**
 * Helper function to wrap any Ethereum RPC call
 *
 * Usage:
 *   const blockNumber = await safeEthRpcCall(() => provider.getBlockNumber());
 *   const balance = await safeEthRpcCall(() => provider.getBalance(address));
 *   const receipt = await safeEthRpcCall(() => tx.wait());
 */
export declare function safeEthRpcCall<T>(fn: () => Promise<T>): Promise<T>;
/**
 * Alternative method for calls with parameters
 *
 * Usage:
 *   const result = await safeEthRpcCallWithArgs(
 *     (addr) => provider.getBalance(addr),
 *     walletAddress
 *   );
 */
export declare function safeEthRpcCallWithArgs<T>(fn: Function, ...args: any[]): Promise<T>;
export default ethRpcBreaker;
//# sourceMappingURL=ethRpcBreaker.d.ts.map
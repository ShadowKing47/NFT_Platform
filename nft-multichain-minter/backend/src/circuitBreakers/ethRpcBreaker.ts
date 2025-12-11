import CircuitBreaker from "opossum";

/**
 * Ethereum RPC Circuit Breaker
 * Protects backend from Ethereum RPC provider failures (Infura, Alchemy, Sepolia, etc.)
 * Prevents cascading failures when RPC endpoints become slow or unresponsive
 */

/**
 * Base function the breaker wraps
 * Receives a function that performs Ethereum RPC calls
 */
async function ethRpcExecutor(fn: Function, ...args: any[]): Promise<any> {
    return fn(...args);
}

/**
 * Circuit breaker configuration:
 * - timeout: how long to wait before considering the RPC call failed
 * - errorThresholdPercentage: % of failures before breaker opens
 * - resetTimeout: time before trying again after opening
 */
export const ethRpcBreaker = new CircuitBreaker(ethRpcExecutor, {
    timeout: 8000,                 // 8 seconds RPC timeout
    errorThresholdPercentage: 50,   // Open circuit if 50% of recent calls fail
    resetTimeout: 15000,            // Try again after 15 seconds
    volumeThreshold: 5,             // Minimum number of requests before calculating error percentage
});

/**
 * Helper function to wrap any Ethereum RPC call
 * 
 * Usage:
 *   const blockNumber = await safeEthRpcCall(() => provider.getBlockNumber());
 *   const balance = await safeEthRpcCall(() => provider.getBalance(address));
 *   const receipt = await safeEthRpcCall(() => tx.wait());
 */
export async function safeEthRpcCall<T>(fn: () => Promise<T>): Promise<T> {
    return ethRpcBreaker.fire(fn);
}

/**
 * Alternative method for calls with parameters
 * 
 * Usage:
 *   const result = await safeEthRpcCallWithArgs(
 *     (addr) => provider.getBalance(addr),
 *     walletAddress
 *   );
 */
export async function safeEthRpcCallWithArgs<T>(
    fn: Function,
    ...args: any[]
): Promise<T> {
    return ethRpcBreaker.fire(fn, ...args);
}

// Event listeners for monitoring circuit breaker state
ethRpcBreaker.on("open", () => {
    console.warn("⚠️ ETH RPC circuit breaker OPENED - RPC provider experiencing issues");
});

ethRpcBreaker.on("halfOpen", () => {
    console.warn("🔄 ETH RPC circuit breaker HALF-OPEN - Testing RPC provider recovery");
});

ethRpcBreaker.on("close", () => {
    console.log("✅ ETH RPC circuit breaker CLOSED - RPC provider healthy");
});

ethRpcBreaker.on("failure", (error) => {
    console.error("❌ ETH RPC call failed:", error.message);
});

ethRpcBreaker.on("success", () => {
    // Optionally log successful calls for debugging
    // console.log("✓ ETH RPC call succeeded");
});

export default ethRpcBreaker;

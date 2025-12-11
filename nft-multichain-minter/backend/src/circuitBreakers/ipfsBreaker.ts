import CircuitBreaker from "opossum";

/**
 * IPFS Upload Circuit Breaker
 * Protects backend from IPFS gateway/upload failures
 * Prevents slowdowns when NFT.Storage or IPFS gateways become unresponsive
 */

/**
 * Base function for IPFS operations
 */
async function ipfsUpload(fn: Function, ...args: any[]): Promise<any> {
    return fn(...args);
}

/**
 * Circuit breaker configuration for IPFS operations
 * IPFS uploads can be slow, so timeout is higher
 */
export const ipfsBreaker = new CircuitBreaker(ipfsUpload, {
    timeout: 10000,                 // 10 seconds for IPFS operations
    errorThresholdPercentage: 50,   // Open circuit if 50% of calls fail
    resetTimeout: 30000,            // Wait 30 seconds before retry
    volumeThreshold: 5,             // Minimum calls before calculating error rate
});

/**
 * Helper function to wrap IPFS operations
 * 
 * Usage:
 *   const cid = await safeIpfsCall(() => uploadImageToIpfs(filePath));
 *   const metadataCid = await safeIpfsCall(() => uploadMetadataToIpfs(metadata));
 */
export async function safeIpfsCall<T>(fn: () => Promise<T>): Promise<T> {
    return ipfsBreaker.fire(fn);
}

/**
 * Alternative method for calls with parameters
 */
export async function safeIpfsCallWithArgs<T>(
    fn: Function,
    ...args: any[]
): Promise<T> {
    return ipfsBreaker.fire(fn, ...args);
}

// Event listeners
ipfsBreaker.on("open", () => {
    console.warn("⚠️ IPFS circuit breaker OPENED - IPFS service experiencing issues");
});

ipfsBreaker.on("halfOpen", () => {
    console.warn("🔄 IPFS circuit breaker HALF-OPEN - Testing IPFS recovery");
});

ipfsBreaker.on("close", () => {
    console.log("✅ IPFS circuit breaker CLOSED - IPFS service healthy");
});

ipfsBreaker.on("failure", (error) => {
    console.error("❌ IPFS operation failed:", error.message);
});

export default ipfsBreaker;

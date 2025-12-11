import { ethers } from "ethers";

/**
 * Verify Ethereum signature with case-insensitive address comparison
 * Normalizes both addresses to lowercase for secure comparison
 */
export function verifyEthereumSignature(
    message: string,
    signature: string,
    wallet: string
): boolean {
    if (!signature || signature.length === 0) {
        throw new Error("Signature cannot be empty");
    }
    
    const recovered = ethers.verifyMessage(message, signature);
    
    // Normalize both addresses to lowercase for comparison
    return recovered.toLowerCase() === wallet.toLowerCase();
}

export function verifyHederaSignature(){
    //Add signature verification
    return true;
}
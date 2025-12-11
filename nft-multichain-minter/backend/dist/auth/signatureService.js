"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEthereumSignature = verifyEthereumSignature;
exports.verifyHederaSignature = verifyHederaSignature;
const ethers_1 = require("ethers");
/**
 * Verify Ethereum signature with case-insensitive address comparison
 * Normalizes both addresses to lowercase for secure comparison
 */
function verifyEthereumSignature(message, signature, wallet) {
    if (!signature || signature.length === 0) {
        throw new Error("Signature cannot be empty");
    }
    const recovered = ethers_1.ethers.verifyMessage(message, signature);
    // Normalize both addresses to lowercase for comparison
    return recovered.toLowerCase() === wallet.toLowerCase();
}
function verifyHederaSignature() {
    //Add signature verification
    return true;
}
//# sourceMappingURL=signatureService.js.map
"use strict";
/**
 * Hedera IPFS operations
 * Re-uses Ethereum IPFS client for consistency
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipfsToHttp = void 0;
exports.uploadImageToIpfs = uploadImageToIpfs;
exports.uploadMetadataToIpfs = uploadMetadataToIpfs;
const ipfs_1 = require("../ethereum/ipfs");
Object.defineProperty(exports, "ipfsToHttp", { enumerable: true, get: function () { return ipfs_1.ipfsToHttp; } });
/**
 * Upload image to IPFS for Hedera NFTs
 * Uses the same NFT.Storage client as Ethereum
 */
async function uploadImageToIpfs(filePath) {
    return (0, ipfs_1.uploadImageToIpfs)(filePath);
}
/**
 * Upload metadata to IPFS for Hedera NFTs
 * Uses the same NFT.Storage client as Ethereum
 */
async function uploadMetadataToIpfs(metadata) {
    return (0, ipfs_1.uploadMetadataToIpfs)(metadata);
}
//# sourceMappingURL=ipfs.js.map
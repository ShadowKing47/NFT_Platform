/**
 * Hedera IPFS operations
 * Re-uses Ethereum IPFS client for consistency
 */

import {
    uploadImageToIpfs as ethUploadImage,
    uploadMetadataToIpfs as ethUploadMetadata,
    ipfsToHttp,
} from "../ethereum/ipfs";

/**
 * Upload image to IPFS for Hedera NFTs
 * Uses the same NFT.Storage client as Ethereum
 */
export async function uploadImageToIpfs(filePath: string): Promise<string> {
    return ethUploadImage(filePath);
}

/**
 * Upload metadata to IPFS for Hedera NFTs
 * Uses the same NFT.Storage client as Ethereum
 */
export async function uploadMetadataToIpfs(metadata: any): Promise<string> {
    return ethUploadMetadata(metadata);
}

/**
 * Convert IPFS URI to HTTP gateway URL
 */
export { ipfsToHttp };

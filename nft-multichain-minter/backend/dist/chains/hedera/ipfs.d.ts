/**
 * Hedera IPFS operations
 * Re-uses Ethereum IPFS client for consistency
 */
import { ipfsToHttp } from "../ethereum/ipfs";
/**
 * Upload image to IPFS for Hedera NFTs
 * Uses the same NFT.Storage client as Ethereum
 */
export declare function uploadImageToIpfs(filePath: string): Promise<string>;
/**
 * Upload metadata to IPFS for Hedera NFTs
 * Uses the same NFT.Storage client as Ethereum
 */
export declare function uploadMetadataToIpfs(metadata: any): Promise<string>;
/**
 * Convert IPFS URI to HTTP gateway URL
 */
export { ipfsToHttp };
//# sourceMappingURL=ipfs.d.ts.map
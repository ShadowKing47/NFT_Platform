/**
 * Hedera NFT Metadata (HIP-412 compatible)
 * https://hips.hedera.com/hip/hip-412
 */
export interface HederaAttribute {
    trait_type: string;
    value: string | number;
}
export interface HederaMetadata {
    name: string;
    description: string;
    image: string;
    type?: string;
    format?: string;
    properties?: {
        creator?: string;
        [key: string]: any;
    };
    attributes?: HederaAttribute[];
    files?: Array<{
        uri: string;
        type: string;
    }>;
}
export interface BuildHederaMetadataParams {
    name: string;
    description: string;
    imageIpfsUri: string;
    creatorWallet?: string;
    userAccountId?: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
    format?: string;
}
/**
 * Build Hedera-compatible metadata object (HIP-412)
 */
export declare function buildHederaMetadata(params: BuildHederaMetadataParams): HederaMetadata;
/**
 * Validate Hedera metadata structure
 */
export declare function validateHederaMetadata(metadata: any): boolean;
//# sourceMappingURL=metadata.d.ts.map
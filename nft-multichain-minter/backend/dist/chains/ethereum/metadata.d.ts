/**
 * ERC-721 Metadata Standard
 * https://docs.opensea.io/docs/metadata-standards
 */
export interface ERC721Attribute {
    trait_type: string;
    value: string | number;
    display_type?: string;
}
export interface ERC721Metadata {
    name: string;
    description: string;
    image: string;
    external_url?: string;
    attributes?: ERC721Attribute[];
    properties?: {
        creator?: string;
        [key: string]: any;
    };
}
export interface BuildERC721MetadataParams {
    name: string;
    description: string;
    imageIpfsUri: string;
    creatorWallet?: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
    externalUrl?: string;
}
/**
 * Build ERC-721 compliant metadata object
 */
export declare function buildErc721Metadata(params: BuildERC721MetadataParams): ERC721Metadata;
/**
 * Validate ERC-721 metadata structure
 */
export declare function validateERC721Metadata(metadata: any): boolean;
//# sourceMappingURL=metadata.d.ts.map
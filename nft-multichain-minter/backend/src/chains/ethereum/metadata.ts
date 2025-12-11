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
    attributes?: Array<{ trait_type: string; value: string | number }>;
    externalUrl?: string;
}

/**
 * Build ERC-721 compliant metadata object
 */
export function buildErc721Metadata(params: BuildERC721MetadataParams): ERC721Metadata {
    const {
        name,
        description,
        imageIpfsUri,
        creatorWallet,
        attributes = [],
        externalUrl,
    } = params;
    
    const metadata: ERC721Metadata = {
        name,
        description,
        image: imageIpfsUri,
    };
    
    // Add external URL if provided
    if (externalUrl) {
        metadata.external_url = externalUrl;
    }
    
    // Add attributes if provided
    if (attributes && attributes.length > 0) {
        metadata.attributes = attributes.map((attr) => ({
            trait_type: attr.trait_type,
            value: attr.value,
        }));
    }
    
    // Add creator information in properties
    if (creatorWallet) {
        metadata.properties = {
            creator: creatorWallet,
        };
    }
    
    return metadata;
}

/**
 * Validate ERC-721 metadata structure
 */
export function validateERC721Metadata(metadata: any): boolean {
    if (!metadata.name || typeof metadata.name !== "string") {
        return false;
    }
    
    if (!metadata.description || typeof metadata.description !== "string") {
        return false;
    }
    
    if (!metadata.image || typeof metadata.image !== "string") {
        return false;
    }
    
    // Validate attributes if present
    if (metadata.attributes) {
        if (!Array.isArray(metadata.attributes)) {
            return false;
        }
        
        for (const attr of metadata.attributes) {
            if (!attr.trait_type || !attr.value) {
                return false;
            }
        }
    }
    
    return true;
}

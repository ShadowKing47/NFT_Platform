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
    attributes?: Array<{ trait_type: string; value: string | number }>;
    format?: string;
}

/**
 * Build Hedera-compatible metadata object (HIP-412)
 */
export function buildHederaMetadata(params: BuildHederaMetadataParams): HederaMetadata {
    const {
        name,
        description,
        imageIpfsUri,
        creatorWallet,
        userAccountId,
        attributes = [],
        format = "image",
    } = params;
    
    const metadata: HederaMetadata = {
        name,
        description,
        image: imageIpfsUri,
        type: "object",
        format,
    };
    
    // Add attributes if provided
    if (attributes && attributes.length > 0) {
        metadata.attributes = attributes.map((attr) => ({
            trait_type: attr.trait_type,
            value: attr.value,
        }));
    }
    
    // Add creator information
    const properties: any = {};
    
    if (creatorWallet || userAccountId) {
        properties.creator = creatorWallet || userAccountId;
    }
    
    if (Object.keys(properties).length > 0) {
        metadata.properties = properties;
    }
    
    // Add files array for HIP-412 compliance
    metadata.files = [
        {
            uri: imageIpfsUri,
            type: getFileType(format),
        },
    ];
    
    return metadata;
}

/**
 * Get MIME type from format
 */
function getFileType(format: string): string {
    const formatMap: Record<string, string> = {
        image: "image/png",
        video: "video/mp4",
        audio: "audio/mpeg",
    };
    
    return formatMap[format] || "image/png";
}

/**
 * Validate Hedera metadata structure
 */
export function validateHederaMetadata(metadata: any): boolean {
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
            if (!attr.trait_type || attr.value === undefined) {
                return false;
            }
        }
    }
    
    return true;
}

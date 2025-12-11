"use strict";
/**
 * Hedera NFT Metadata (HIP-412 compatible)
 * https://hips.hedera.com/hip/hip-412
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHederaMetadata = buildHederaMetadata;
exports.validateHederaMetadata = validateHederaMetadata;
/**
 * Build Hedera-compatible metadata object (HIP-412)
 */
function buildHederaMetadata(params) {
    const { name, description, imageIpfsUri, creatorWallet, userAccountId, attributes = [], format = "image", } = params;
    const metadata = {
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
    const properties = {};
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
function getFileType(format) {
    const formatMap = {
        image: "image/png",
        video: "video/mp4",
        audio: "audio/mpeg",
    };
    return formatMap[format] || "image/png";
}
/**
 * Validate Hedera metadata structure
 */
function validateHederaMetadata(metadata) {
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
//# sourceMappingURL=metadata.js.map
"use strict";
/**
 * ERC-721 Metadata Standard
 * https://docs.opensea.io/docs/metadata-standards
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildErc721Metadata = buildErc721Metadata;
exports.validateERC721Metadata = validateERC721Metadata;
/**
 * Build ERC-721 compliant metadata object
 */
function buildErc721Metadata(params) {
    const { name, description, imageIpfsUri, creatorWallet, attributes = [], externalUrl, } = params;
    const metadata = {
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
function validateERC721Metadata(metadata) {
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
//# sourceMappingURL=metadata.js.map
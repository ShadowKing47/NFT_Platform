import { NFTStorage, Blob } from "nft.storage";
import fs from "fs/promises";
import logger from "../../utils/logger";

const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY || "";

if (!NFT_STORAGE_API_KEY) {
    logger.warn("NFT_STORAGE_API_KEY is not set. IPFS uploads will fail.");
}

// Only initialize client if API key is provided
let client: NFTStorage | null = null;
if (NFT_STORAGE_API_KEY && NFT_STORAGE_API_KEY !== "your_nft_storage_key") {
    client = new NFTStorage({ token: NFT_STORAGE_API_KEY });
}

/**
 * Upload image file to IPFS via NFT.Storage
 */
export async function uploadImageToIpfs(filePath: string): Promise<string> {
    if (!client) {
        const errorMsg = !NFT_STORAGE_API_KEY || NFT_STORAGE_API_KEY === "your_nft_storage_key"
            ? "NFT.Storage API key is not configured. Please set NFT_STORAGE_API_KEY in your .env file. Get a free API key at https://nft.storage"
            : "NFT.Storage client initialization failed";
        logger.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        // Read file as buffer
        const fileBuffer = await fs.readFile(filePath);
        
        // Upload to IPFS
        const cid = await client.storeBlob(new Blob([fileBuffer]));
        
        logger.info({ cid }, "Image uploaded to IPFS successfully");
        return `ipfs://${cid}`;
    } catch (error: any) {
        logger.error({ error: error.message }, "Failed to upload image to IPFS");
        
        // Provide more specific error messages
        if (error.message?.includes("Unauthorized") || error.message?.includes("401")) {
            throw new Error("Invalid NFT.Storage API key. Please check your NFT_STORAGE_API_KEY in .env file.");
        }
        if (error.message?.includes("Network") || error.message?.includes("ENOTFOUND")) {
            throw new Error("Network error: Unable to connect to NFT.Storage. Please check your internet connection.");
        }
        
        throw new Error(`IPFS image upload failed: ${error.message}`);
    }
}

/**
 * Upload metadata JSON to IPFS via NFT.Storage
 */
export async function uploadMetadataToIpfs(metadata: any): Promise<string> {
    if (!client) {
        const errorMsg = !NFT_STORAGE_API_KEY || NFT_STORAGE_API_KEY === "your_nft_storage_key"
            ? "NFT.Storage API key is not configured. Please set NFT_STORAGE_API_KEY in your .env file. Get a free API key at https://nft.storage"
            : "NFT.Storage client initialization failed";
        logger.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        // Convert metadata to JSON string
        const metadataJson = JSON.stringify(metadata, null, 2);
        
        // Create blob from JSON
        const blob = new Blob([metadataJson], { type: "application/json" });
        
        // Upload to IPFS
        const cid = await client.storeBlob(blob);
        
        logger.info({ cid }, "Metadata uploaded to IPFS successfully");
        return `ipfs://${cid}`;
    } catch (error: any) {
        logger.error({ error: error.message }, "Failed to upload metadata to IPFS");
        
        // Provide more specific error messages
        if (error.message?.includes("Unauthorized") || error.message?.includes("401")) {
            throw new Error("Invalid NFT.Storage API key. Please check your NFT_STORAGE_API_KEY in .env file.");
        }
        if (error.message?.includes("Network") || error.message?.includes("ENOTFOUND")) {
            throw new Error("Network error: Unable to connect to NFT.Storage. Please check your internet connection.");
        }
        
        throw new Error(`IPFS metadata upload failed: ${error.message}`);
    }
}

/**
 * Convert IPFS URI to HTTP gateway URL
 */
export function ipfsToHttp(ipfsUri: string): string {
    if (ipfsUri.startsWith("ipfs://")) {
        const cid = ipfsUri.replace("ipfs://", "");
        return `https://ipfs.io/ipfs/${cid}`;
    }
    return ipfsUri;
}

import { NFTStorage, File, Blob } from "nft.storage";
import fs from "fs/promises";
import path from "path";

const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY || "";

if (!NFT_STORAGE_API_KEY) {
    console.warn("NFT_STORAGE_API_KEY is not set. IPFS uploads will fail.");
}

const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });

/**
 * Upload image file to IPFS via NFT.Storage
 */
export async function uploadImageToIpfs(filePath: string): Promise<string> {
    try {
        // Read file as buffer
        const fileBuffer = await fs.readFile(filePath);
        const fileName = path.basename(filePath);
        
        // Create File object
        const file = new File([fileBuffer], fileName, {
            type: getMimeType(fileName),
        });
        
        // Upload to IPFS
        const cid = await client.storeBlob(new Blob([fileBuffer]));
        
        return `ipfs://${cid}`;
    } catch (error) {
        console.error("Failed to upload image to IPFS:", error);
        throw new Error("IPFS image upload failed");
    }
}

/**
 * Upload metadata JSON to IPFS via NFT.Storage
 */
export async function uploadMetadataToIpfs(metadata: any): Promise<string> {
    try {
        // Convert metadata to JSON string
        const metadataJson = JSON.stringify(metadata, null, 2);
        
        // Create blob from JSON
        const blob = new Blob([metadataJson], { type: "application/json" });
        
        // Upload to IPFS
        const cid = await client.storeBlob(blob);
        
        return `ipfs://${cid}`;
    } catch (error) {
        console.error("Failed to upload metadata to IPFS:", error);
        throw new Error("IPFS metadata upload failed");
    }
}

/**
 * Helper to determine MIME type from file extension
 */
function getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
        ".mp4": "video/mp4",
        ".webm": "video/webm",
    };
    
    return mimeTypes[ext] || "application/octet-stream";
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

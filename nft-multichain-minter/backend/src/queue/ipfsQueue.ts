import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export interface IPFSUploadJob {
    type: "image" | "metadata";
    filePath?: string;
    metadata?: any;
    originalName?: string;
}

export interface IPFSUploadResult {
    ipfsUri: string;
    cid: string;
}

/**
 * Queue for IPFS upload operations
 */
export const ipfsQueue = new Queue<IPFSUploadJob>("ipfs-upload", {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
    },
});

/**
 * Add image upload job to queue
 */
export async function addImageUploadJob(
    filePath: string,
    originalName: string
): Promise<string> {
    const job = await ipfsQueue.add("upload-image", {
        type: "image",
        filePath,
        originalName,
    });
    
    return job.id as string;
}

/**
 * Add metadata upload job to queue
 */
export async function addMetadataUploadJob(
    metadata: any
): Promise<string> {
    const job = await ipfsQueue.add("upload-metadata", {
        type: "metadata",
        metadata,
    });
    
    return job.id as string;
}

export default ipfsQueue;

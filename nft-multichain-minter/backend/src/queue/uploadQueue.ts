import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export interface FileUploadJob {
    filePath: string;
    originalName: string;
    mimeType: string;
    size: number;
    walletAddress: string;
    chain: "ethereum" | "hedera";
}

export interface FileUploadResult {
    success: boolean;
    ipfsUri?: string;
    error?: string;
}

/**
 * Queue for file upload operations
 */
export const uploadQueue = new Queue<FileUploadJob>("uploadQueue", {
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
 * Add file upload job to queue
 */
export async function addFileUploadJob(
    filePath: string,
    originalName: string,
    mimeType: string,
    size: number,
    walletAddress: string,
    chain: "ethereum" | "hedera"
): Promise<string> {
    const job = await uploadQueue.add("upload-file", {
        filePath,
        originalName,
        mimeType,
        size,
        walletAddress,
        chain,
    });
    
    return job.id as string;
}

export default uploadQueue;

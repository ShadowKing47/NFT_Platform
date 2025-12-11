import { Queue } from "bullmq";
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
export declare const uploadQueue: Queue<FileUploadJob, any, string, FileUploadJob, any, string>;
/**
 * Add file upload job to queue
 */
export declare function addFileUploadJob(filePath: string, originalName: string, mimeType: string, size: number, walletAddress: string, chain: "ethereum" | "hedera"): Promise<string>;
export default uploadQueue;
//# sourceMappingURL=uploadQueue.d.ts.map
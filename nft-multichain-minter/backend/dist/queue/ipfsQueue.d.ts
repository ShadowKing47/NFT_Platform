import { Queue } from "bullmq";
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
export declare const ipfsQueue: Queue<IPFSUploadJob, any, string, IPFSUploadJob, any, string>;
/**
 * Add image upload job to queue
 */
export declare function addImageUploadJob(filePath: string, originalName: string): Promise<string>;
/**
 * Add metadata upload job to queue
 */
export declare function addMetadataUploadJob(metadata: any): Promise<string>;
export default ipfsQueue;
//# sourceMappingURL=ipfsQueue.d.ts.map
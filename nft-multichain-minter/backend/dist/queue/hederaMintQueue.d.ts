import { Queue } from "bullmq";
export interface HederaMintJob {
    userAccountId: string;
    metadataIpfsUri: string;
    name?: string;
    description?: string;
}
export interface HederaMintResult {
    tokenId: string;
    serialNumber: number;
    transactionId?: string;
}
/**
 * Queue for Hedera NFT minting operations
 */
export declare const hederaMintQueue: Queue<HederaMintJob, any, string, HederaMintJob, any, string>;
/**
 * Add Hedera mint job to queue
 */
export declare function addHederaMintJob(userAccountId: string, metadataIpfsUri: string, name?: string, description?: string): Promise<string>;
export default hederaMintQueue;
//# sourceMappingURL=hederaMintQueue.d.ts.map
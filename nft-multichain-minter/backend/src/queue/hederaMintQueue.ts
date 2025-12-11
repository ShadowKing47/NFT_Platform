import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

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
export const hederaMintQueue = new Queue<HederaMintJob>("hedera-mint", {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
        timeout: 60000, // 60 second timeout for mint operations
    },
});

/**
 * Add Hedera mint job to queue
 */
export async function addHederaMintJob(
    userAccountId: string,
    metadataIpfsUri: string,
    name?: string,
    description?: string
): Promise<string> {
    const job = await hederaMintQueue.add("mint-nft", {
        userAccountId,
        metadataIpfsUri,
        name,
        description,
    });
    
    return job.id as string;
}

export default hederaMintQueue;

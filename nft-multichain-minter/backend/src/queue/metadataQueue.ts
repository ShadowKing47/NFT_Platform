import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export interface MetadataBuildJob {
    chain: "ethereum" | "hedera";
    name: string;
    description: string;
    imageIpfsUri: string;
    creatorWallet?: string;
    userAccountId?: string;
    attributes?: Array<{ trait_type: string; value: string }>;
    externalUrl?: string;
}

export interface MetadataResult {
    metadata: any;
    chain: string;
}

/**
 * Queue for metadata building operations
 */
export const metadataQueue = new Queue<MetadataBuildJob>("metadata-build", {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 2,
        backoff: {
            type: "fixed",
            delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
    },
});

/**
 * Add metadata build job to queue
 */
export async function addMetadataBuildJob(
    params: MetadataBuildJob
): Promise<string> {
    const job = await metadataQueue.add("build-metadata", params);
    return job.id as string;
}

/**
 * Add Ethereum metadata build job
 */
export async function addEthereumMetadataJob(
    name: string,
    description: string,
    imageIpfsUri: string,
    creatorWallet: string,
    attributes?: Array<{ trait_type: string; value: string }>,
    externalUrl?: string
): Promise<string> {
    return addMetadataBuildJob({
        chain: "ethereum",
        name,
        description,
        imageIpfsUri,
        creatorWallet,
        attributes,
        externalUrl,
    });
}

/**
 * Add Hedera metadata build job
 */
export async function addHederaMetadataJob(
    name: string,
    description: string,
    imageIpfsUri: string,
    userAccountId: string,
    attributes?: Array<{ trait_type: string; value: string }>
): Promise<string> {
    return addMetadataBuildJob({
        chain: "hedera",
        name,
        description,
        imageIpfsUri,
        userAccountId,
        attributes,
    });
}

export default metadataQueue;

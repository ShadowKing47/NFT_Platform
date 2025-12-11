import { Queue } from "bullmq";
export interface MetadataBuildJob {
    chain: "ethereum" | "hedera";
    name: string;
    description: string;
    imageIpfsUri: string;
    creatorWallet?: string;
    userAccountId?: string;
    attributes?: Array<{
        trait_type: string;
        value: string;
    }>;
    externalUrl?: string;
}
export interface MetadataResult {
    metadata: any;
    chain: string;
}
/**
 * Queue for metadata building operations
 */
export declare const metadataQueue: Queue<MetadataBuildJob, any, string, MetadataBuildJob, any, string>;
/**
 * Add metadata build job to queue
 */
export declare function addMetadataBuildJob(params: MetadataBuildJob): Promise<string>;
/**
 * Add Ethereum metadata build job
 */
export declare function addEthereumMetadataJob(name: string, description: string, imageIpfsUri: string, creatorWallet: string, attributes?: Array<{
    trait_type: string;
    value: string;
}>, externalUrl?: string): Promise<string>;
/**
 * Add Hedera metadata build job
 */
export declare function addHederaMetadataJob(name: string, description: string, imageIpfsUri: string, userAccountId: string, attributes?: Array<{
    trait_type: string;
    value: string;
}>): Promise<string>;
export default metadataQueue;
//# sourceMappingURL=metadataQueue.d.ts.map
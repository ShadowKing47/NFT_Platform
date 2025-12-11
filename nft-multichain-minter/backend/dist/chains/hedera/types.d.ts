/**
 * Hedera chain type definitions
 */
export interface HederaMintParams {
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
export interface BuildHederaMetadataParams {
    name: string;
    description: string;
    imageIpfsUri: string;
    creatorWallet?: string;
    userAccountId?: string;
    attributes?: Array<{
        trait_type: string;
        value: string;
    }>;
    format?: string;
}
export interface HederaNFTInfo {
    tokenId: string;
    serialNumber: number;
    accountId: string;
    metadata: Buffer;
    createdTimestamp: string;
}
export interface HederaTransactionResult {
    status: string;
    transactionId: string;
    receipt?: any;
}
export interface HederaConfig {
    operatorId: string;
    operatorKey: string;
    tokenId: string;
    network: "mainnet" | "testnet" | "previewnet";
}
//# sourceMappingURL=types.d.ts.map
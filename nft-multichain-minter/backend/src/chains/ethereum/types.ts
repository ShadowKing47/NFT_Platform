/**
 * Ethereum chain type definitions
 */

export interface EthereumMintParams {
    tokenUri: string;
    recipientAddress: string;
    contractAddress: string;
}

export interface EthereumMintResult {
    success: boolean;
    transactionHash: string;
    tokenId?: string;
    blockNumber?: number;
}

export interface EthereumPrepareMintParams {
    file: Express.Multer.File;
    name: string;
    description: string;
    walletAddress: string;
    attributes?: Array<{ trait_type: string; value: string }>;
    externalUrl?: string;
}

export interface EthereumPrepareMintResult {
    success: boolean;
    tokenUri: string;
    imageIpfsUri: string;
    metadata: any;
}

export interface EthereumContractConfig {
    address: string;
    abi: any[];
    network: string;
}

export interface EthereumTransactionReceipt {
    transactionHash: string;
    blockNumber: number;
    gasUsed: string;
    status: boolean;
}

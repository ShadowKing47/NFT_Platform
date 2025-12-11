export interface HederaMintResult {
    tokenId: string;
    serialNumber: number;
}
export declare function mintHederaNftToUser(params: {
    userAccountId: string;
    metadataIpfsUri: string;
}): Promise<HederaMintResult>;
//# sourceMappingURL=mint.d.ts.map
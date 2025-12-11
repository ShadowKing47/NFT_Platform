export declare function generateNonce(): string;
export declare function storeNonce(wallet: string, nonce: string): Promise<void>;
export declare function getNonce(wallet: string): Promise<string | null>;
export declare function deleteNonce(wallet: string): Promise<number>;
//# sourceMappingURL=nonceService.d.ts.map
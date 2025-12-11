/**
 * Audit log entry structure
 */
export interface MintAuditEntry {
    requestId: string;
    walletAddress: string;
    chain: "ethereum" | "hedera";
    metadataIpfsUri: string;
    imageIpfsUri: string;
    tokenId?: string;
    serialNumber?: number;
    timestamp: Date;
    status: "success" | "failed" | "pending";
    error?: string;
}
/**
 * Log mint operation for audit trail
 * In production, this should write to a database (MongoDB/Postgres)
 */
export declare function logMintOperation(entry: MintAuditEntry): void;
/**
 * Log authentication event
 */
export declare function logAuthEvent(requestId: string, wallet: string, event: "nonce_generated" | "signature_verified" | "jwt_issued" | "auth_failed", success: boolean, error?: string): void;
//# sourceMappingURL=auditLog.d.ts.map
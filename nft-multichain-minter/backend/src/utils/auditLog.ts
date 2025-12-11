import logger from "./logger";

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
export function logMintOperation(entry: MintAuditEntry): void {
    logger.info(
        {
            audit: true,
            requestId: entry.requestId,
            wallet: entry.walletAddress,
            chain: entry.chain,
            metadataUri: entry.metadataIpfsUri,
            imageUri: entry.imageIpfsUri,
            tokenId: entry.tokenId,
            serialNumber: entry.serialNumber,
            status: entry.status,
            error: entry.error,
            timestamp: entry.timestamp.toISOString(),
        },
        "Mint operation audit log"
    );

    // TODO: In production, write to database:
    // await MintAuditModel.create(entry);
}

/**
 * Log authentication event
 */
export function logAuthEvent(
    requestId: string,
    wallet: string,
    event: "nonce_generated" | "signature_verified" | "jwt_issued" | "auth_failed",
    success: boolean,
    error?: string
): void {
    logger.info(
        {
            audit: true,
            requestId,
            wallet,
            event,
            success,
            error,
            timestamp: new Date().toISOString(),
        },
        "Authentication audit log"
    );
}

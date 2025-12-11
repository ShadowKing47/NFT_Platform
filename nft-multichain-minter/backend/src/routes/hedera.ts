import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadImageToIpfs, uploadMetadataToIpfs } from "../chains/hedera/ipfs";
import { buildHederaMetadata, HederaMetadata } from "../chains/hedera/metadata";
import { mintHederaNftToUser } from "../chains/hedera/mint";
import { validateUpload } from "../middleware/validateUpload";
import { validateMetadata } from "../middleware/validateMetadata";
import { rateLimiterPerChain } from "../middleware/rateLimiterPerChain";
import { sanitizeMetadata } from "../utils/sanitization";
import { isValidHederaAccountId, normalizeHederaAccountId } from "../utils/validation";
import { validateFileContent } from "../utils/fileValidation";
import { logMintOperation } from "../utils/auditLog";
import logger from "../utils/logger";

const router = Router();

interface HederaMintResponse {
    success: boolean;
    tokenId: string;
    serialNumber: number;
    imageIpfsUri: string;
    metadataIpfsUri: string;
    metadata: HederaMetadata;
}

const upload = multer({
    dest: path.join(__dirname, "..", "..", "..", "tmp", "uploads"),
});

router.post(
    "/mint",
    upload.single("file"),
    validateUpload,
    validateMetadata,
    rateLimiterPerChain("hedera"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const requestId = req.id || "unknown";
        
        try {
            const file = req.file;
            const { name, description, userAccountId, attributes } = req.body;

            if (!file) {
                return void res.status(400).json({ error: "File is required" });
            }
            
            if (!name || !description || !userAccountId) {
                return void res.status(400).json({
                    error: "Name, description and userAccountId are required",
                });
            }

            // Validate Hedera account ID format (0.0.xxxxx)
            if (!isValidHederaAccountId(userAccountId)) {
                return void res.status(400).json({
                    error: "Invalid Hedera account ID format. Expected format: 0.0.xxxxx",
                });
            }

            const normalizedAccountId = normalizeHederaAccountId(userAccountId);
            const localFilePath = file.path;

            // Validate file content using magic bytes
            const fileValidation = await validateFileContent(localFilePath);
            if (!fileValidation.valid) {
                fs.unlinkSync(localFilePath);
                logger.error({ requestId, error: fileValidation.error }, "File validation failed");
                return void res.status(400).json({ error: fileValidation.error });
            }

            logger.info({ requestId, mimeType: fileValidation.mimeType }, "File validated successfully");

            const imageIpfsUri = await uploadImageToIpfs(localFilePath);

            // Parse and sanitize attributes
            let parsedAttributes: Array<{ trait_type: string; value: string | number }> = [];
            if (attributes) {
                try {
                    const parsed = JSON.parse(attributes);
                    parsedAttributes = Array.isArray(parsed) ? parsed : [];
                } catch {
                    logger.warn({ requestId }, "Failed to parse attributes JSON");
                }
            }

            // Sanitize all metadata inputs
            const sanitized = sanitizeMetadata({
                name,
                description,
                attributes: parsedAttributes,
            });

            const metadata = buildHederaMetadata({
                name: sanitized.name,
                description: sanitized.description,
                imageIpfsUri,
                creatorWallet: normalizedAccountId,
                attributes: sanitized.attributes,
            });

            // Upload metadata to IPFS
            const metadataIpfsUri = await uploadMetadataToIpfs(metadata);

            // Clean up local file
            fs.unlink(localFilePath, () => null);

            // Mint Hedera NFT and transfer to user
            const { tokenId, serialNumber } = await mintHederaNftToUser({
                userAccountId: normalizedAccountId,
                metadataIpfsUri,
            });

            // Log mint operation for audit
            logMintOperation({
                requestId,
                walletAddress: normalizedAccountId,
                chain: "hedera",
                metadataIpfsUri,
                imageIpfsUri,
                tokenId,
                serialNumber,
                timestamp: new Date(),
                status: "success",
            });

            logger.info({ requestId, tokenId, serialNumber }, "Hedera mint completed successfully");

            const response: HederaMintResponse = {
                success: true,
                tokenId,
                serialNumber,
                imageIpfsUri,
                metadataIpfsUri,
                metadata,
            };

            return void res.json(response);
        } catch (err: any) {
            logger.error({ requestId, error: err.message }, "Hedera mint failed");
            
            // Log failed mint operation
            logMintOperation({
                requestId,
                walletAddress: req.body.userAccountId || "unknown",
                chain: "hedera",
                metadataIpfsUri: "",
                imageIpfsUri: "",
                timestamp: new Date(),
                status: "failed",
                error: err.message,
            });
            
            next(err);
        }
    }
);

export default router;
        
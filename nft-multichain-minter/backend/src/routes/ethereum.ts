import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadImageToIpfs, uploadMetadataToIpfs } from "../chains/ethereum/ipfs";
import { buildErc721Metadata, ERC721Metadata } from "../chains/ethereum/metadata";
import { validateUpload } from "../middleware/validateUpload";
import { validateMetadata } from "../middleware/validateMetadata";
import { rateLimiterPerChain } from "../middleware/rateLimiterPerChain";
import { sanitizeMetadata } from "../utils/sanitization";
import { isValidEthereumAddress, normalizeEthereumAddress } from "../utils/validation";
import { validateFileContent } from "../utils/fileValidation";
import { logMintOperation } from "../utils/auditLog";
import logger from "../utils/logger";

const router = Router();

const upload = multer({
    dest: path.join(__dirname, "..","..","..","tmp","uploads"),
});

interface PrepareMintResponse {
    success: boolean;
    tokenUri: string;
    imageIpfsUri: string;
    metadata: ERC721Metadata;
}

router.post(
    "/prepare-mint",
    upload.single("file"),
    validateUpload,
    validateMetadata,
    rateLimiterPerChain("ethereum"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const requestId = req.id || "unknown";
        
        try {
            const file = req.file;
            const { name, description, walletAddress, attributes } = req.body;
            
            if (!file) {
                return void res.status(400).json({ error: "File is required" });
            }

            if (!name || !description) {
                return void res.status(400).json({ error: "Name and description are required" });
            }

            // Validate wallet address format
            if (walletAddress && !isValidEthereumAddress(walletAddress)) {
                return void res.status(400).json({ error: "Invalid Ethereum wallet address" });
            }

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

            const metadata = buildErc721Metadata({
                name: sanitized.name,
                description: sanitized.description,
                imageIpfsUri,
                creatorWallet: walletAddress ? normalizeEthereumAddress(walletAddress) : undefined,
                attributes: sanitized.attributes,
                externalUrl: undefined,
            });

            const tokenUri = await uploadMetadataToIpfs(metadata);

            // Log mint preparation for audit
            logMintOperation({
                requestId,
                walletAddress: walletAddress ? normalizeEthereumAddress(walletAddress) : "unknown",
                chain: "ethereum",
                metadataIpfsUri: tokenUri,
                imageIpfsUri,
                timestamp: new Date(),
                status: "pending",
            });

            logger.info({ requestId, tokenUri }, "Ethereum mint preparation completed");

            const response: PrepareMintResponse = {
                success: true,
                tokenUri,
                imageIpfsUri,
                metadata,
            };

            return void res.json(response);
        } catch (err: any) {
            logger.error({ requestId, error: err.message }, "Ethereum mint preparation failed");
            next(err);
        }
    }
);

export default router;
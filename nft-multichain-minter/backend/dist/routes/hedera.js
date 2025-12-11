"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ipfs_1 = require("../chains/hedera/ipfs");
const metadata_1 = require("../chains/hedera/metadata");
const mint_1 = require("../chains/hedera/mint");
const validateUpload_1 = require("../middleware/validateUpload");
const validateMetadata_1 = require("../middleware/validateMetadata");
const rateLimiterPerChain_1 = require("../middleware/rateLimiterPerChain");
const sanitization_1 = require("../utils/sanitization");
const validation_1 = require("../utils/validation");
const fileValidation_1 = require("../utils/fileValidation");
const auditLog_1 = require("../utils/auditLog");
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    dest: path_1.default.join(__dirname, "..", "..", "..", "tmp", "uploads"),
});
router.post("/mint", upload.single("file"), validateUpload_1.validateUpload, validateMetadata_1.validateMetadata, (0, rateLimiterPerChain_1.rateLimiterPerChain)("hedera"), async (req, res, next) => {
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
        if (!(0, validation_1.isValidHederaAccountId)(userAccountId)) {
            return void res.status(400).json({
                error: "Invalid Hedera account ID format. Expected format: 0.0.xxxxx",
            });
        }
        const normalizedAccountId = (0, validation_1.normalizeHederaAccountId)(userAccountId);
        const localFilePath = file.path;
        // Validate file content using magic bytes
        const fileValidation = await (0, fileValidation_1.validateFileContent)(localFilePath);
        if (!fileValidation.valid) {
            fs_1.default.unlinkSync(localFilePath);
            logger_1.default.error({ requestId, error: fileValidation.error }, "File validation failed");
            return void res.status(400).json({ error: fileValidation.error });
        }
        logger_1.default.info({ requestId, mimeType: fileValidation.mimeType }, "File validated successfully");
        const imageIpfsUri = await (0, ipfs_1.uploadImageToIpfs)(localFilePath);
        // Parse and sanitize attributes
        let parsedAttributes = [];
        if (attributes) {
            try {
                const parsed = JSON.parse(attributes);
                parsedAttributes = Array.isArray(parsed) ? parsed : [];
            }
            catch {
                logger_1.default.warn({ requestId }, "Failed to parse attributes JSON");
            }
        }
        // Sanitize all metadata inputs
        const sanitized = (0, sanitization_1.sanitizeMetadata)({
            name,
            description,
            attributes: parsedAttributes,
        });
        const metadata = (0, metadata_1.buildHederaMetadata)({
            name: sanitized.name,
            description: sanitized.description,
            imageIpfsUri,
            creatorWallet: normalizedAccountId,
            attributes: sanitized.attributes,
        });
        // Upload metadata to IPFS
        const metadataIpfsUri = await (0, ipfs_1.uploadMetadataToIpfs)(metadata);
        // Clean up local file
        fs_1.default.unlink(localFilePath, () => null);
        // Mint Hedera NFT and transfer to user
        const { tokenId, serialNumber } = await (0, mint_1.mintHederaNftToUser)({
            userAccountId: normalizedAccountId,
            metadataIpfsUri,
        });
        // Log mint operation for audit
        (0, auditLog_1.logMintOperation)({
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
        logger_1.default.info({ requestId, tokenId, serialNumber }, "Hedera mint completed successfully");
        const response = {
            success: true,
            tokenId,
            serialNumber,
            imageIpfsUri,
            metadataIpfsUri,
            metadata,
        };
        return void res.json(response);
    }
    catch (err) {
        logger_1.default.error({ requestId, error: err.message }, "Hedera mint failed");
        // Log failed mint operation
        (0, auditLog_1.logMintOperation)({
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
});
exports.default = router;
//# sourceMappingURL=hedera.js.map
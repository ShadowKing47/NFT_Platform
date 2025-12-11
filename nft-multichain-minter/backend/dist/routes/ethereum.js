"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ipfs_1 = require("../chains/ethereum/ipfs");
const metadata_1 = require("../chains/ethereum/metadata");
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
router.post("/prepare-mint", upload.single("file"), validateUpload_1.validateUpload, validateMetadata_1.validateMetadata, (0, rateLimiterPerChain_1.rateLimiterPerChain)("ethereum"), async (req, res, next) => {
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
        if (walletAddress && !(0, validation_1.isValidEthereumAddress)(walletAddress)) {
            return void res.status(400).json({ error: "Invalid Ethereum wallet address" });
        }
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
        const metadata = (0, metadata_1.buildErc721Metadata)({
            name: sanitized.name,
            description: sanitized.description,
            imageIpfsUri,
            creatorWallet: walletAddress ? (0, validation_1.normalizeEthereumAddress)(walletAddress) : undefined,
            attributes: sanitized.attributes,
            externalUrl: undefined,
        });
        const tokenUri = await (0, ipfs_1.uploadMetadataToIpfs)(metadata);
        // Log mint preparation for audit
        (0, auditLog_1.logMintOperation)({
            requestId,
            walletAddress: walletAddress ? (0, validation_1.normalizeEthereumAddress)(walletAddress) : "unknown",
            chain: "ethereum",
            metadataIpfsUri: tokenUri,
            imageIpfsUri,
            timestamp: new Date(),
            status: "pending",
        });
        logger_1.default.info({ requestId, tokenUri }, "Ethereum mint preparation completed");
        const response = {
            success: true,
            tokenUri,
            imageIpfsUri,
            metadata,
        };
        return void res.json(response);
    }
    catch (err) {
        logger_1.default.error({ requestId, error: err.message }, "Ethereum mint preparation failed");
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=ethereum.js.map
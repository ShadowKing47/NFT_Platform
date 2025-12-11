"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileContent = validateFileContent;
exports.validateFileSize = validateFileSize;
const file_type_1 = __importDefault(require("file-type"));
/**
 * Allowed MIME types for NFT images
 */
const ALLOWED_MIME_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/svg+xml",
];
/**
 * Maximum file size (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;
/**
 * Validate file using magic bytes (not just MIME type from frontend)
 * Prevents disguised malicious files
 */
async function validateFileContent(filePath) {
    try {
        // Detect actual file type from magic bytes
        const detectedType = await file_type_1.default.fromFile(filePath);
        if (!detectedType) {
            return {
                valid: false,
                error: "Unable to determine file type",
            };
        }
        // Check if MIME type is allowed
        if (!ALLOWED_MIME_TYPES.includes(detectedType.mime)) {
            return {
                valid: false,
                error: `Unsupported file type: ${detectedType.mime}. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
            };
        }
        return {
            valid: true,
            mimeType: detectedType.mime,
        };
    }
    catch (error) {
        return {
            valid: false,
            error: "File validation failed",
        };
    }
}
/**
 * Validate file size
 */
function validateFileSize(size) {
    if (size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        };
    }
    return { valid: true };
}
//# sourceMappingURL=fileValidation.js.map
import fileType from "file-type";

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
export async function validateFileContent(
    filePath: string
): Promise<{ valid: boolean; error?: string; mimeType?: string }> {
    try {
        // Detect actual file type from magic bytes
        const detectedType = await fileType.fromFile(filePath);

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
    } catch (error) {
        return {
            valid: false,
            error: "File validation failed",
        };
    }
}

/**
 * Validate file size
 */
export function validateFileSize(size: number): {
    valid: boolean;
    error?: string;
} {
    if (size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        };
    }

    return { valid: true };
}

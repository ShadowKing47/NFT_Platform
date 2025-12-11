import validator from "validator";

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeString(input: string): string {
    if (!input || typeof input !== "string") {
        return "";
    }
    // Escape HTML entities and trim whitespace
    return validator.escape(input.trim());
}

/**
 * Sanitize NFT metadata fields
 */
export interface SanitizedMetadata {
    name: string;
    description: string;
    attributes: Array<{ trait_type: string; value: string | number }>;
}

export function sanitizeMetadata(input: {
    name: string;
    description: string;
    attributes?: any;
}): SanitizedMetadata {
    const sanitized: SanitizedMetadata = {
        name: sanitizeString(input.name),
        description: sanitizeString(input.description),
        attributes: [],
    };

    // Sanitize attributes array
    if (Array.isArray(input.attributes)) {
        sanitized.attributes = input.attributes
            .filter(
                (attr) =>
                    attr &&
                    typeof attr === "object" &&
                    attr.trait_type &&
                    attr.value !== undefined
            )
            .map((attr) => ({
                trait_type: sanitizeString(attr.trait_type),
                value:
                    typeof attr.value === "number"
                        ? attr.value
                        : sanitizeString(String(attr.value)),
            }));
    }

    return sanitized;
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
    if (!filename || typeof filename !== "string") {
        return "unnamed";
    }

    // Remove directory traversal attempts and special characters
    return filename
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/\.{2,}/g, "_")
        .slice(0, 255);
}

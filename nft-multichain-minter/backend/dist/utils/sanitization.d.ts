/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export declare function sanitizeString(input: string): string;
/**
 * Sanitize NFT metadata fields
 */
export interface SanitizedMetadata {
    name: string;
    description: string;
    attributes: Array<{
        trait_type: string;
        value: string | number;
    }>;
}
export declare function sanitizeMetadata(input: {
    name: string;
    description: string;
    attributes?: any;
}): SanitizedMetadata;
/**
 * Sanitize filename to prevent directory traversal
 */
export declare function sanitizeFilename(filename: string): string;
//# sourceMappingURL=sanitization.d.ts.map
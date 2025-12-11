/**
 * Validate file using magic bytes (not just MIME type from frontend)
 * Prevents disguised malicious files
 */
export declare function validateFileContent(filePath: string): Promise<{
    valid: boolean;
    error?: string;
    mimeType?: string;
}>;
/**
 * Validate file size
 */
export declare function validateFileSize(size: number): {
    valid: boolean;
    error?: string;
};
//# sourceMappingURL=fileValidation.d.ts.map
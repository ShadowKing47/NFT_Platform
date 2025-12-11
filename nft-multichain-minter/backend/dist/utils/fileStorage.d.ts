/**
 * Generate a unique file path for temporary storage
 */
export declare function getTempFilePath(originalName: string): string;
/**
 * Save uploaded file to temporary storage
 */
export declare function saveTempFile(buffer: Buffer, originalName: string): Promise<string>;
/**
 * Delete temporary file
 */
export declare function deleteTempFile(filePath: string): Promise<void>;
/**
 * Clean up old temporary files (older than 1 hour)
 */
export declare function cleanupOldTempFiles(): Promise<void>;
//# sourceMappingURL=fileStorage.d.ts.map
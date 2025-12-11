import fs from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const TEMP_DIR = path.join(__dirname, "..", "..", "..", "tmp", "uploads");

/**
 * Ensure temp directory exists
 */
async function ensureTempDir(): Promise<void> {
    try {
        await fs.access(TEMP_DIR);
    } catch {
        await fs.mkdir(TEMP_DIR, { recursive: true });
    }
}

/**
 * Generate a unique file path for temporary storage
 */
export function getTempFilePath(originalName: string): string {
    const uniqueId = randomBytes(16).toString("hex");
    const ext = path.extname(originalName);
    const filename = `${uniqueId}${ext}`;
    return path.join(TEMP_DIR, filename);
}

/**
 * Save uploaded file to temporary storage
 */
export async function saveTempFile(
    buffer: Buffer,
    originalName: string
): Promise<string> {
    await ensureTempDir();
    const filePath = getTempFilePath(originalName);
    await fs.writeFile(filePath, buffer);
    return filePath;
}

/**
 * Delete temporary file
 */
export async function deleteTempFile(filePath: string): Promise<void> {
    try {
        await fs.unlink(filePath);
    } catch (error: any) {
        // Ignore if file doesn't exist
        if (error.code !== "ENOENT") {
            console.error("Failed to delete temp file:", error);
        }
    }
}

/**
 * Clean up old temporary files (older than 1 hour)
 */
export async function cleanupOldTempFiles(): Promise<void> {
    try {
        await ensureTempDir();
        const files = await fs.readdir(TEMP_DIR);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        for (const file of files) {
            const filePath = path.join(TEMP_DIR, file);
            const stats = await fs.stat(filePath);
            
            if (now - stats.mtimeMs > oneHour) {
                await deleteTempFile(filePath);
            }
        }
    } catch (error) {
        console.error("Failed to cleanup old temp files:", error);
    }
}

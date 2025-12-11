"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTempFilePath = getTempFilePath;
exports.saveTempFile = saveTempFile;
exports.deleteTempFile = deleteTempFile;
exports.cleanupOldTempFiles = cleanupOldTempFiles;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const TEMP_DIR = path_1.default.join(__dirname, "..", "..", "..", "tmp", "uploads");
/**
 * Ensure temp directory exists
 */
async function ensureTempDir() {
    try {
        await promises_1.default.access(TEMP_DIR);
    }
    catch {
        await promises_1.default.mkdir(TEMP_DIR, { recursive: true });
    }
}
/**
 * Generate a unique file path for temporary storage
 */
function getTempFilePath(originalName) {
    const uniqueId = (0, crypto_1.randomBytes)(16).toString("hex");
    const ext = path_1.default.extname(originalName);
    const filename = `${uniqueId}${ext}`;
    return path_1.default.join(TEMP_DIR, filename);
}
/**
 * Save uploaded file to temporary storage
 */
async function saveTempFile(buffer, originalName) {
    await ensureTempDir();
    const filePath = getTempFilePath(originalName);
    await promises_1.default.writeFile(filePath, buffer);
    return filePath;
}
/**
 * Delete temporary file
 */
async function deleteTempFile(filePath) {
    try {
        await promises_1.default.unlink(filePath);
    }
    catch (error) {
        // Ignore if file doesn't exist
        if (error.code !== "ENOENT") {
            console.error("Failed to delete temp file:", error);
        }
    }
}
/**
 * Clean up old temporary files (older than 1 hour)
 */
async function cleanupOldTempFiles() {
    try {
        await ensureTempDir();
        const files = await promises_1.default.readdir(TEMP_DIR);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        for (const file of files) {
            const filePath = path_1.default.join(TEMP_DIR, file);
            const stats = await promises_1.default.stat(filePath);
            if (now - stats.mtimeMs > oneHour) {
                await deleteTempFile(filePath);
            }
        }
    }
    catch (error) {
        console.error("Failed to cleanup old temp files:", error);
    }
}
//# sourceMappingURL=fileStorage.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeString = sanitizeString;
exports.sanitizeMetadata = sanitizeMetadata;
exports.sanitizeFilename = sanitizeFilename;
const validator_1 = __importDefault(require("validator"));
/**
 * Sanitize user input to prevent XSS and injection attacks
 */
function sanitizeString(input) {
    if (!input || typeof input !== "string") {
        return "";
    }
    // Escape HTML entities and trim whitespace
    return validator_1.default.escape(input.trim());
}
function sanitizeMetadata(input) {
    const sanitized = {
        name: sanitizeString(input.name),
        description: sanitizeString(input.description),
        attributes: [],
    };
    // Sanitize attributes array
    if (Array.isArray(input.attributes)) {
        sanitized.attributes = input.attributes
            .filter((attr) => attr &&
            typeof attr === "object" &&
            attr.trait_type &&
            attr.value !== undefined)
            .map((attr) => ({
            trait_type: sanitizeString(attr.trait_type),
            value: typeof attr.value === "number"
                ? attr.value
                : sanitizeString(String(attr.value)),
        }));
    }
    return sanitized;
}
/**
 * Sanitize filename to prevent directory traversal
 */
function sanitizeFilename(filename) {
    if (!filename || typeof filename !== "string") {
        return "unnamed";
    }
    // Remove directory traversal attempts and special characters
    return filename
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/\.{2,}/g, "_")
        .slice(0, 255);
}
//# sourceMappingURL=sanitization.js.map
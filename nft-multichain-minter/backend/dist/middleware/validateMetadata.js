"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMetadata = void 0;
const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_METADATA_SIZE = 500 * 1024; // 500KB max metadata size
const validateMetadata = (req, res, next) => {
    const { name, description, attributes } = req.body;
    // Check total request body size
    const bodySize = JSON.stringify(req.body).length;
    if (bodySize > MAX_METADATA_SIZE) {
        return res.status(400).json({
            error: `Metadata size exceeds maximum allowed (${MAX_METADATA_SIZE} bytes)`,
        });
    }
    if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Name is required and must be a string" });
    }
    if (name.length > MAX_NAME_LENGTH) {
        return res.status(400).json({
            error: `Name must not exceed ${MAX_NAME_LENGTH} characters`,
        });
    }
    if (!description || typeof description !== "string") {
        return res.status(400).json({ error: "Description is required and must be a string" });
    }
    if (description.length > MAX_DESCRIPTION_LENGTH) {
        return res.status(400).json({
            error: `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
        });
    }
    if (attributes) {
        try {
            const parsed = JSON.parse(attributes);
            if (!Array.isArray(parsed)) {
                return res.status(400).json({
                    error: "Attributes must be a valid JSON array",
                });
            }
        }
        catch (err) {
            return res.status(400).json({
                error: "Attributes must be a valid JSON array",
            });
        }
    }
    return next();
};
exports.validateMetadata = validateMetadata;
//# sourceMappingURL=validateMetadata.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpload = void 0;
const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const validateUpload = (req, res, next) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "File is required" });
    }
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
        return res.status(400).json({
            error: "Invalid file type. Only PNG and JPG/JPEG are allowed.",
        });
    }
    if (file.size > MAX_SIZE) {
        return res.status(400).json({
            error: "File size exceeds 10MB limit.",
        });
    }
    return next();
};
exports.validateUpload = validateUpload;
//# sourceMappingURL=validateUpload.js.map
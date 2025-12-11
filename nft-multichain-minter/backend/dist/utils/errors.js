"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
}
//# sourceMappingURL=errors.js.map
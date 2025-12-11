"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = requestIdMiddleware;
const crypto_1 = require("crypto");
/**
 * Middleware to add unique request correlation ID
 * Enables request tracing across logs and services
 */
function requestIdMiddleware(req, res, next) {
    req.id = (0, crypto_1.randomUUID)();
    res.setHeader("X-Request-ID", req.id);
    next();
}
//# sourceMappingURL=requestId.js.map
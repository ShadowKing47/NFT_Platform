"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = void 0;
const jwtService_1 = require("./jwtService");
const jwtMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Missing or invalid token" });
        }
        const token = authHeader.substring(7);
        const decoded = (0, jwtService_1.verifyJwt)(token);
        if (!decoded || !decoded.wallet) {
            return res.status(401).json({ error: "Invalid token payload" });
        }
        req.wallet = decoded.wallet;
        return next();
    }
    catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};
exports.jwtMiddleware = jwtMiddleware;
//# sourceMappingURL=jwtMiddleware.js.map
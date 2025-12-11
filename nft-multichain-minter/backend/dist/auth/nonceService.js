"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNonce = generateNonce;
exports.storeNonce = storeNonce;
exports.getNonce = getNonce;
exports.deleteNonce = deleteNonce;
const redis_1 = __importDefault(require("../config/redis"));
const crypto_1 = require("crypto");
function generateNonce() {
    return (0, crypto_1.randomBytes)(16).toString("hex");
}
async function storeNonce(wallet, nonce) {
    await redis_1.default.set(`nonce:${wallet}`, nonce, "EX", 300);
}
async function getNonce(wallet) {
    return redis_1.default.get(`nonce:${wallet}`);
}
async function deleteNonce(wallet) {
    return redis_1.default.del(`nonce:${wallet}`);
}
//# sourceMappingURL=nonceService.js.map
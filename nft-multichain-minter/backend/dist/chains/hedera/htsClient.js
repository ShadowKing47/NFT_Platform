"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hederaClient = void 0;
exports.getHederaClient = getHederaClient;
exports.getOperatorAccountId = getOperatorAccountId;
const sdk_1 = require("@hashgraph/sdk");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const HEDERA_NETWORK = process.env.HEDERA_NETWORK || "testnet";
const HEDERA_OPERATOR_ID = process.env.HEDERA_OPERATOR_ID || "";
const HEDERA_OPERATOR_KEY = process.env.HEDERA_OPERATOR_KEY || "";
let client = null;
function getHederaClient() {
    if (client)
        return client;
    if (!HEDERA_OPERATOR_ID || !HEDERA_OPERATOR_KEY) {
        throw new Error("Hedera operator credentials are not configured");
    }
    const operatorId = sdk_1.AccountId.fromString(HEDERA_OPERATOR_ID);
    const operatorKey = sdk_1.PrivateKey.fromString(HEDERA_OPERATOR_KEY);
    client =
        HEDERA_NETWORK === "mainnet"
            ? sdk_1.Client.forMainnet()
            : HEDERA_NETWORK === "previewnet"
                ? sdk_1.Client.forPreviewnet()
                : sdk_1.Client.forTestnet();
    client.setOperator(operatorId, operatorKey);
    return client;
}
// Export lazy-initialized client (null if credentials missing)
let _hederaClient = null;
try {
    if (HEDERA_OPERATOR_ID && HEDERA_OPERATOR_KEY) {
        _hederaClient = getHederaClient();
    }
}
catch (error) {
    console.warn("Hedera client initialization failed - Hedera features will be unavailable");
}
exports.hederaClient = _hederaClient;
function getOperatorAccountId() {
    if (!HEDERA_OPERATOR_ID)
        return null;
    return sdk_1.AccountId.fromString(HEDERA_OPERATOR_ID);
}
//# sourceMappingURL=htsClient.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
index_1.default.listen(PORT, () => {
    logger_1.default.info(`Backend running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map
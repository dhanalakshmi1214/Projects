"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_PASSWORD = exports.EMAIL_SENDER = exports.PORT = exports.REFRESH_SECRET_KEY = exports.SECRET_KEY = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
exports.REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || "default_refresh_secret_key";
exports.PORT = 8001;
exports.EMAIL_SENDER = "crazydhanachandran14@gmail.com";
exports.EMAIL_PASSWORD = "mxpvfeywcczddyfo";

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
// generate the auth middleware:
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../utils/config");
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_KEY);
        req.userData = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Auth failed. You are not authorized to access this route",
        });
    }
};
exports.authMiddleware = authMiddleware;

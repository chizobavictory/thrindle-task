"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyUser = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const uuid_1 = require("uuid");
const notifications_1 = require("../notifications");
const jwt_1 = require("../utils/jwt");
const config_1 = require("../utils/config");
// Register
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "Please input your username, email, and password",
        });
    }
    const otp = (0, uuid_1.v4)().substring(0, 6);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
            message: "Invalid email address format",
        });
    }
    try {
        const userEmail = yield user_1.default.findOne({ email: req.body.email });
        if (userEmail) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const encryptedPassword = crypto_js_1.default.AES.encrypt(req.body.password, config_1.config.SECRET_KEY).toString();
        const newUser = new user_1.default({
            username: req.body.username,
            email: req.body.email,
            password: encryptedPassword,
            otp: otp,
        });
        const token = (0, jwt_1.generateUsersToken)({ id: newUser.id, email: newUser.email });
        const savedUser = yield newUser.save();
        const welcomeEmailHtml = (0, notifications_1.welcomeEmail)(savedUser.username, otp, token);
        yield (0, notifications_1.sendEmail)(savedUser.email, "Welcome to Thrindle - Email Verification", welcomeEmailHtml);
        res.status(200).json(savedUser); // Send the saved user as a response
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
exports.register = register;
// Verify OTP
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, otp } = req.body;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (otp !== user.otp) {
            return res.status(401).json({ error: "Invalid OTP" });
        }
        user.isVerified = true;
        user.otp = undefined;
        yield user.save();
        const username = user.username;
        res.status(200).json({ message: "User successfully verified", username });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Verification failed" });
    }
});
exports.verifyUser = verifyUser;
//Login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json("User does not exist");
        }
        const hashedPassword = crypto_js_1.default.AES.decrypt(user.password, config_1.config.SECRET_KEY);
        const originalPassword = hashedPassword.toString(crypto_js_1.default.enc.Utf8);
        if (originalPassword !== req.body.password) {
            return res.status(401).json("Wrong password credentials");
        }
        if (!user.isVerified) {
            // If the user is not verified, send them an email with the OTP
            const otp = (0, uuid_1.v4)().substring(0, 6);
            user.otp = otp;
            yield user.save();
            const verificationEmailHtml = `<p>Your verification OTP is: ${otp}</p>`;
            yield (0, notifications_1.sendEmail)(user.email, "Verify Your Account", verificationEmailHtml);
            return res.status(401).json({ message: "Account not verified. Check your email for the verification OTP." });
        }
        const accessToken = (0, jwt_1.generateUsersToken)({ id: user._id, email: user.email });
        const _a = user.toObject(), { password } = _a, others = __rest(_a, ["password"]);
        res.status(200).json(Object.assign(Object.assign({}, others), { accessToken }));
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
exports.login = login;

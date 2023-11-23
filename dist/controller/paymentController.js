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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTransactions = exports.verifyPayment = exports.initializePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../utils/config");
const BASE_URL = "https://api.paystack.co";
const initializePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, email } = req.body;
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${config_1.config.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
    };
    try {
        const response = yield axios_1.default.post(`${BASE_URL}/transaction/initialize`, {
            email,
            amount: amount * 100,
        }, { headers });
        res.json({
            status: true,
            message: "successful transaction",
            data: response.data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "failed to initialize transaction",
            data: null,
        });
    }
});
exports.initializePayment = initializePayment;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reference } = req.params;
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${config_1.config.PAYSTACK_SECRET_KEY}`,
    };
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/transaction/verify/${reference}`, { headers });
        res.json({
            status: true,
            message: "transaction verified",
            data: response.data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "failed to verify transaction",
            data: null,
        });
    }
});
exports.verifyPayment = verifyPayment;
const listTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = req.query; // Assuming you want to search by date range
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${config_1.config.PAYSTACK_SECRET_KEY}`,
    };
    try {
        // Construct the Paystack API URL with optional query parameters
        const apiUrl = `${BASE_URL}/transaction?`;
        // Add query parameters based on user input
        const queryParams = [];
        if (startDate) {
            queryParams.push(`startDate=${startDate}`);
        }
        if (endDate) {
            queryParams.push(`endDate=${endDate}`);
        }
        // Make the GET request to Paystack
        const response = yield axios_1.default.get(apiUrl + queryParams.join("&"), { headers });
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "failed to retrieve transactions",
            data: null,
        });
    }
});
exports.listTransactions = listTransactions;

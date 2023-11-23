"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controller/paymentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.post("/initialize", paymentController_1.initializePayment);
router.get("/verify/:reference", paymentController_1.verifyPayment);
router.get("/transactions", paymentController_1.listTransactions);
exports.default = router;

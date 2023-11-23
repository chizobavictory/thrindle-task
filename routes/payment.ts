import { Router } from "express";
import { initializePayment, listTransactions, verifyPayment } from "../controller/paymentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/initialize", initializePayment);
router.get("/verify/:reference", verifyPayment);
router.get("/transactions", listTransactions);

export default router;

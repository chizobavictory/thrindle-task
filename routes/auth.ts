import { Router, Request, Response } from "express";
import { login, register, verifyUser } from "../controller/userController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyUser);

export default router;

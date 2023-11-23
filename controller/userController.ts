import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendEmail, welcomeEmail } from "../notifications";
import { generateUsersToken } from "../utils/jwt";

// Register
export const register = async (req: Request, res: Response) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).json({
      message: "Please input your username, email, and password",
    });
  }
  const otp = uuidv4().substring(0, 6);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation

  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({
      message: "Invalid email address format",
    });
  }

  try {
    const userEmail = await User.findOne({ email: req.body.email });
    if (userEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const encryptedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY || "").toString();

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: encryptedPassword,
      otp: otp,
    });

    const token = generateUsersToken({ id: newUser.id, email: newUser.email });

    const savedUser = await newUser.save();

    // Send welcome email with verification link
    // const verificationToken = jwt.sign({ userId: savedUser._id }, process.env.JWT_KEY || "", { expiresIn: "1h" });

    const welcomeEmailHtml = welcomeEmail(savedUser.username, otp, token);

    await sendEmail(savedUser.email, "Welcome to Thrindle - Email Verification", welcomeEmailHtml);

    res.status(200).json(savedUser); // Send the saved user as a response
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// Verify OTP
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (otp !== user.otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;

    await user.save();

    const username = user.username;

    res.status(200).json({ message: "User successfully verified", username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Verification failed" });
  }
};

//Login
export const login = async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json("User does not exist");
    }

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY || "");
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password) {
      return res.status(401).json("Wrong password credentials");
    }

    const accessToken = generateUsersToken({ id: user._id, email: user.email });

    const { password, ...others } = user.toObject();

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

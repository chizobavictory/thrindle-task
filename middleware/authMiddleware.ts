// generate the auth middleware:
import jwt from "jsonwebtoken";
import { config } from "../utils/config";

interface UserData {
  id: number;
  email: string;
}

export const authMiddleware = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, config.JWT_KEY as jwt.Secret) as jwt.Jwt & jwt.JwtPayload & UserData;
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};



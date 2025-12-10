import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "./jwtService";

export interface AuthRequest extends Request {
  wallet?: string;
}

export const jwtMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = authHeader.substring(7);

    const decoded = verifyJwt(token) as { wallet: string };

    if (!decoded || !decoded.wallet) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.wallet = decoded.wallet;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

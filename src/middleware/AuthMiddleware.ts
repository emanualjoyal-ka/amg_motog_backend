import dotenv from "dotenv"
import { CookieOptions, NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import sessionSchema from "../models/sessionSchema.js"



dotenv.config()

interface DecodedToken extends jwt.JwtPayload {
    id: string;
    email: string;
    user: any;
    jti: string;
    role:string
}


const cookieOptions=(): CookieOptions=>({
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
    path:"/"
})


export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Use promise version
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    const session = await sessionSchema.findOne({ tokenId: payload.jti, valid: true });
    if (!session) {
      res.clearCookie("accessToken", cookieOptions());
      res.clearCookie("refreshToken", cookieOptions());
      return res.status(403).json({ success: false, message: "Session is no longer valid" });
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      user: payload.user,
      jti: payload.jti,
      exp: payload.exp,
      iat: payload.iat,
      role:payload.role || "admin"
    };

    res.session = session;
    next();

  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
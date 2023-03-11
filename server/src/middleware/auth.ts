import { Request, Response, NextFunction } from "express";
import {
  verify,
  JsonWebTokenError,
  TokenExpiredError,
  JwtPayload,
} from "jsonwebtoken";
import { config } from "../config";
import { UserPayload } from "../@types";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = (req.headers.authorization as string)?.split(" ")[1];

  const accessToken = req.session?.jwt || token;

  if (!accessToken) {
    return res.status(401).json({ msg: "Unauthorised access", success: false });
  }
  try {
    const payload = verify(accessToken, config.JWT_SECRET) as UserPayload;

    req.userId = payload?.user || payload.email;
    next();
  } catch (error: any) {
    if (
      error instanceof JsonWebTokenError ||
      error instanceof TokenExpiredError
    ) {
      return res.status(401).json({ msg: "Invalid Token", success: false });
    }
    console.error("Internal auth error");
    res.status(500).json({ msg: "Internal auth error", error });
  }
};

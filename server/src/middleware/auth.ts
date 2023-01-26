import { Request, Response, NextFunction } from "express";
import jwt, { verify } from "jsonwebtoken";
import { config } from "../config";

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
    verify(accessToken, config.JWT_SECRET, (error: any, decodedData: any) => {
      if (error || !decodedData) {
        console.log("error decoding data");
        return res
          .status(401)
          .json({ msg: "Unauthorised access", success: false });
      } else {
        req.userId = decodedData?.user || decodedData;
        next();
      }
    });
  } catch (error: any) {
    console.error("Internal auth error");
    res.status(500).json({ msg: "Internal auth error" });
  }
};

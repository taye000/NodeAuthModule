import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { sign } from "jsonwebtoken";
import User from "../models/users";
import { PasswordManager } from "../utils";
import { config } from "../config/config";

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  if (!email.trim()) {
    return res.status(400).json({ msg: "Email is required" });
  }
  if (!password.trim()) {
    return res.status(400).json({ msg: "Password is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: "Email Not Found", success: false });
  }
  //check password
  const passwordMatch = await PasswordManager.compare(user.password, password);

  if (!passwordMatch) {
    return res.status(400).json({ msg: "Password Incorrect" });
  }
  try {
    //generate token
    const payload = {
      email: user.email,
      id: user.id,
    };
    const token = sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_SECRET_EXPIRY,
    });

    //cookie session
    req.session = {
      jwt: token,
    };

    res.status(200).send({
      user,
      cookie: req.session?.jwt,
      msg: "User signed in successfully",
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({ msg: "Internal server error", success: false });
  }
};

//get the current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ msg: "User Not Found", success: false });
    }
    return res.json({ msg: "Found current user.", user, success: true });
  } catch (error: any) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//sign out of the system
export const logout = async (req: Request, res: Response) => {
  req.session = null;
  res.status(200).json({ success: true, msg: "Sign out successful." });
};

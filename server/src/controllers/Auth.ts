import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { sign } from "jsonwebtoken";
import User from "../models/users";
import { PasswordManager, randomCode } from "../utils";
import { config } from "../config/config";
import { mailer, sms } from "../helpers";

export const login = async (req: Request, res: Response) => {
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
  try {
    //check password
    const passwordMatch = await PasswordManager.compare(
      user.password,
      password
    );
    if (!passwordMatch) {
      return res.status(400).json({ msg: "Password Incorrect" });
    }
    //generate otp
    const otp = await randomCode();
    //update user otp
    const updatedUser = await User.findByIdAndUpdate(
      user?.id,
      {
        passwordReset: { is_changed: true },
        otp: otp,
      },
      { new: true }
    );
    //save user
    await user.save();

    //send otp via email
    // mailer(otp, user.email);

    //send otp via sms
    // sms(otp, user.phoneNumber);

    res.status(200).json({
      otp,
      success: true,
      msg: "Successful accessed your account, use OTP sent to your email & phone to proceed.",
      user: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ msg: "Internal server error", success: false });
  }
};

//Verify user login by otp
export const verifyUserLoginByOTP = async (req: Request, res: Response) => {
  const { otp } = req.body;

  if (!otp.trim()) {
    return res.status(400).json({ msg: "OTP is required" });
  }
  try {
    //check if otp matches the user otp
    const user = await User.findOne({ otp });
    if (!user) {
      return res.status(400).json({ msg: "OTP does not match" });
    }
    //payload for generating jwt token
    const payload = {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    //generate token
    const token = sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_SECRET_EXPIRY,
    });

    //cookie session
    req.session = {
      jwt: token,
    };

    res.status(200).send({
      success: true,
      msg: "User signed in successfully",
      cookie: req.session?.jwt,
      user,
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
    return res.json({ msg: "Found current user.", success: true, user });
  } catch (error: any) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//sign out of the system
export const logout = async (req: Request, res: Response) => {
  req.session = null;
  res.status(200).json({ success: true, msg: "Sign out successful." });
};

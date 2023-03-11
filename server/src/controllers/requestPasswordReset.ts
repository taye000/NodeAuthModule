import { Request, Response } from "express";
import User from "../models/users";
import { randomCode } from "../utils/common";
import { mailer, sms } from "../helpers";

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not exist." });
    }
    //generate reset code
    const code = await randomCode();

    const updatedUser = await User.findByIdAndUpdate(
      user?.id,
      {
        passwordReset: { is_changed: true },
        otp: code,
      },
      { new: true }
    );
    console.log(code);

    //send code via email
    await mailer(code, email);

    //send code via sms
    // sms(code, user.phoneNumber);

    res.status(201).json({
      success: true,
      msg: "Password reset code successfully sent to your email & phone.",
      user: updatedUser,
    });
  } catch (error: any) {
    res.status(409).json({ error: error.message });
  }
};

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
        passwordResetToken: code,
      },
      { new: true }
    );
    console.log(code);

    //send code via email
    await mailer(code, email);

    //send code via sms
    sms(code);

    res.status(201).json({
      code: code,
      user: updatedUser,
      msg: "Successfully requested update password.",
      success: true,
    });
  } catch (error: any) {
    res.status(409).json({ error: error.message });
  }
};

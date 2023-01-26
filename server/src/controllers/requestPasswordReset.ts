import { Request, Response } from "express";
import User from "../models/users";
import validator from "validator";
import { randomCode } from "../utils/common";
import { mailer, sms } from "../helpers";

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (validator.isEmpty(email)) {
    return res.status(400).json({ email: "email is required" });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ msg: "Email provided does not exist. Please try again later." });
  }
  //generate reset code
  const code = await randomCode();

  //update user password
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
  mailer(code, email);

  //send code via sms
  sms(code);

  res.status(201).json({
    code: code,
    user: updatedUser,
    msg: "Successfully requested update password.",
    success: true,
  });
};

import { Request, Response } from "express";
import User from "../models/users";

export const passwordReset = async (req: Request, res: Response) => {
  const { code, password, confirmPassword } = req.body;

  try {
    const user = await User.findOne({ otp: code });
    if (!user) {
      return res.send({ msg: "User Not found." });
    }
    //compare password and confirm password
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ msg: "Password & confirm password Do Not Match!" });
    }

    user.password = password;
    user.otp = "";
    user.passwordReset = { is_changed: false };

    //save the updated password to db
    await user.save();

    res.status(201).json({
      success: true,
      msg: "Password reset successfully",
      user,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ msg: "Internal server error", success: false, error });
  }
};

import { Request, Response } from "express";
import User from "../models/users";
import { PasswordManager } from "../utils";
import validator from "validator";

export const passwordReset = async (req: Request, res: Response) => {
  const { code, password, confirmPassword } = req.body;

  const user = await User.findOne({ passwordResetToken: code });
  if (!user) {
    return res.send({ msg: "Code provided is Not correct." });
  }
  if (validator.isEmpty(code)) {
    return res.status(400).json({ code: "Code is required" });
  }
  if (validator.isEmpty(password)) {
    return res.status(400).json({ password: "Password is required" });
  }
  if (validator.isEmpty(confirmPassword)) {
    return res
      .status(400)
      .json({ confirmPassword: "confirm Password is required" });
  }
  //compare password and confirm password
  if (password !== confirmPassword) {
    return res.send({ msg: "Password & confirm password Do Not Match!" });
  }

  //hash updated password before saving to db
  let hashedPassword = await PasswordManager.toHash(password);

  user.password = hashedPassword;
  user.passwordReset = { code: "", is_changed: false };

  //save the hashed updated password to db
  await user.save();
  res.status(201).json({
    success: true,
    user: user,
    msg: "Password reset successfully",
  });
};

import { Request, Response } from "express";
import User from "../models/users";
import { PasswordManager } from "../utils";

export const currentUserResetPassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorised access." });
    }
    if (!currentPassword.trim()) {
      return res
        .status(400)
        .json({ newPassword: "Current Password is required" });
    }
    if (!newPassword.trim()) {
      return res.status(400).json({ newPassword: "New Password is required" });
    }
    if (!confirmNewPassword.trim()) {
      return res
        .status(400)
        .json({ confirmNewPassword: "confirm New Password is required" });
    }
    const isPasswordCorrect = await PasswordManager.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, msg: "Incorrect current password" });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        msg: "New password and confirm new password Do Not Match.",
      });
    }
    //compare new password to the old password
    const newPasswordNotSameAsOld = await PasswordManager.compare(
      user.password,
      newPassword
    );
    //check if new password is same as old password
    if (newPasswordNotSameAsOld) {
      return res
        .status(400)
        .json({ newPassword: "New Password cannot be same as old password" });
    }
    //hashing the updated password
    let hashedPassword = await PasswordManager.toHash(newPassword);

    user.password = hashedPassword;
    user.otp = "";
    user.passwordReset = { is_changed: false };

    //save the hashed updated password to db
    await user.save();

    return res
      .status(200)
      .json({ success: true, msg: "Password updated succesfully." });
  } catch (error: any) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

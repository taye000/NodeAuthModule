import { Request, Response } from "express";
import User from "../models/users";
import validator from "validator";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config";

//init cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
});
//init multer with cloudinary storage
const upload = multer({ storage: cloudinaryStorage });

//update profile photo controller
export const updateProfilePhoto = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req?.userId);
    if (!user) {
      res.send({ msg: "Unauthorized access" });
    }
    const photo = req?.file?.path;
    await User.findByIdAndUpdate(req?.userId, {
      photo,
    });
  } catch (error) {
    res.send({ msg: "Error uploading photo" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  const user = await User.findById(req?.userId);

  if (!user) {
    return res.send({ msg: "Unauthorized access" });
  }
  //check if user name is valid
  if (!validator.isLength(name, { min: 3, max: 30 })) {
    return res.status(400).json({ message: "User name is invalid" });
  }
  //check if email is valid
  if (validator.isEmail(email)) {
    return res.send({ msg: "Please provide a valid email" });
  }

  const isEmailTaken = await User.findOne({ email });
  if (isEmailTaken && isEmailTaken.id !== req?.userId) {
    return res.send({ msg: "Email is already taken." });
  }
  const updatedUser = await User.findByIdAndUpdate(
    req?.userId,
    {
      name,
      email,
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    msg: "Profile updated successfully",
    response: updatedUser,
  });
};

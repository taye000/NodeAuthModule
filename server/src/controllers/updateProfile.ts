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
  const { name, email, photo } = req.body;

  const user = await User.findById(req?.userId);

  if (!user) {
    return res.send({ msg: "Unauthorized access" });
  }

  if (validator.isEmail(email)) {
    return res.send({ msg: "Please provide a valid email" });
  }

  if (email.toLowercase() === user?.email) {
    return res.send({ msg: "Email provided is same as previous email" });
  }

  const isEmailTaken = await User.findOne({ email });

  if (isEmailTaken) {
    return res.send({ msg: "Email provided already exists." });
  }
  const updatedUser = await User.findByIdAndUpdate(
    req?.userId,
    {
      name,
      email,
      photo,
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    msg: "Profile updated successfully",
    response: updatedUser,
  });
};

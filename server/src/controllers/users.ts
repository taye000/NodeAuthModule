import User from "../models/users";
import validator from "validator";

//create a new user
export const signUp = async (req: any, res: any) => {
  const { name, email, phoneNumber, password } = req.body;

  if (!email.trim()) {
    return res.status(400).json({ email: "email is required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ email: "Please enter a valid email" });
  }
  if (!phoneNumber.trim()) {
    return res.status(400).json({ phoneNumber: "Phone Number is required" });
  }
  if (!password.trim()) {
    return res.status(400).json({ password: "Password is required" });
  }

  try {
    //check if user email already exist in db
    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(400).json({ email: "User email already exists" });

    //check if user phone number already exist in db
    const phoneNoExists = await User.findOne({ phoneNumber });
    if (phoneNoExists) {
      return res
        .status(400)
        .json({ phoneNumber: "User phone Number already exists" });
    }

    //create new user
    const createUser = await User.create({
      name,
      email,
      phoneNumber,
      password,
    });
    //save user
    let newUser = await createUser.save();

    res
      .status(201)
      .json({ success: true, msg: "New User Created Successfully", newUser });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

//get a user by id
export const getUserById = async (id: string) => {
  try {
    return await User.findById(id);
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

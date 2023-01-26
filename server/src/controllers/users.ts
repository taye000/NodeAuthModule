import User from "../models/users";
import validator from "validator";

//create a new user
export const signUp = async (req: any, res: any) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (validator.isEmpty(email)) {
    return res.status(400).json({ email: "email is required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ email: "Please enter a valid email" });
  }
  if (validator.isEmpty(password)) {
    return res.status(400).json({ password: "Password is required" });
  }

  try {
    const createUser = await User.create({ name, email, password });
    let newUser = await createUser.save();
    res.status(201).json({ newUser });
    console.log("new user", newUser);
  } catch (error: any) {
    res.status(409).json({ error: error.message });
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

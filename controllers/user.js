import User from "../modals/user.js";
import { sendCookies } from "../middleware/cookie.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const addNewUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email: email });
  console.log("user :", user);
  if (user?.email) {
    return res.json({
      success: false,
      message: "already account exist with email",
    });
  }
  try {
    //bcryprting the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    console.log(process.env.JWT_SECRET);
    console.log(user);
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
    return res.status(201).json({
      success:"true",
      message:"your account is created",
      user,
      token
    })
    // sendCookies(res, newUser, "successfully register", 201);
  } catch (err) {
    res.json({ success: false, message: "error in register" });
  }
};

export const logInUser = async (req, res) => {
  console.log("processing req");
  const { email, password } = req.body;
  try {
    console.log("trying login");
    const user = await User.findOne({ email: email }).select("+password");
    console.log(user);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        console.log("match");
        // const user = await User.findOne({ _id: user._id });
        const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
        console.log(token);

        return res.status(200).json({
          success:"true",
          message:"successfull logged in",
          user,
          token
        })

        // sendCookies(res, userWithPost, "succefully login", 200);
      } else res.json({ success: false, message: "incorrect password" });
    } else {
      res.json({ success:false, message:"user doesn't exist" });
    }
  } catch (err) {
    res.status(404);
  }
};

export const logOutUser = async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Develpoment" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Develpoment" ? false : true,
    })
    .json({
      success: true,
      user: req.user,
      message: "logged out",
    });
};

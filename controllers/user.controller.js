import dotenv from "dotenv";
dotenv.config();
import { hash, compare } from "bcrypt";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import uploadToCloudinary from "../utils/cloudinary.js";
const jwtSecret = process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  console.log(req.body, req.file);

  try {
    if (username === "" || email === "" || password === "") {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res.status(422).json({ message: "user already exists" });
    }

    const hashedPassword = await hash(password, 12);

    if (req.file) {
      const image = await uploadToCloudinary(req.file.path);

      const newUser = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        photo: image.url,
      });

      res.status(201).json({
        message: "user created successfully",
        user: newUser,
      });
    } else {
      const newUser = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        photo: "",
      });

      return res
        .status(201)
        .json({ message: "user created successfully", newUser });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === "" || password === "") {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({ message: "login successfull"});
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = undefined;
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({ message: "logout success" });
};



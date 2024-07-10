import dotenv from "dotenv";
dotenv.config();
import { hash, compare } from "bcrypt";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import uploadToCloudinary from "../utils/cloudinary.js";
const jwtSecret = process.env.JWT_SECRET;
import nodemailer from "nodemailer";
import { Otp } from "../models/otp.model.js";
const userEmail = process.env.EMAIL;
const userPassword = process.env.PASSWORD;

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: userEmail,
    pass: userPassword,
  },
});

export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    if (username === "" || email === "" || password === "") {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
      if (user.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      } else {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    let mailOptions = {
      to: email,
      subject: "Welcome Email",
      html: `<h1> Welcome , ${username} 😀 . ThankYou for choosing us.</h1>`,
    };

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

      res.status(201).json({ message: "user created successfully", newUser });
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) error;
    });
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

    const token = jwt.sign({ userId: user._id,username:user.username }, jwtSecret, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({ message: "login successfull" });
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    User.create;
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

export const forgetPassword = async(req, res) => {
  const { email } = req.body;

  if (email === "")
    return res.status(400).json({ message: "Please provide your email" });
  try {

    const user = await User.findOne({ email });
   
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  let newOtp = generateOTP();

  const savedOpt = Otp.create({
    userEmail: email,
    otp: newOtp,
  });

  const mailOptions={
    to:email,
    subject:"Reset Password",
    html:`<p>This is otp for reset password : ${newOtp} and will be valid for 3 minutes</p>`
  }
   const sentOTP =await transporter.sendMail(mailOptions)

  if(savedOpt ){
    return res.status(200).json({ message: "OTP sent successfully" });
  }
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  
};


export const resetPassword = async(req,res)=>{
  const {otp,newPassword}=req.body
  
try {
  
  const checkOpt= await Otp.findOne({otp})

  if(!checkOpt || checkOpt.otp!==otp){
    return res.status(401).json({message:"Invalid OTP"})
  }
  const hashedNewPassword= await hash(newPassword,12)

  const updatePass = await User.findOneAndUpdate({email:checkOpt.userEmail},{password:hashedNewPassword},{new:true})

  if(updatePass){
    return res.status(200).json({message:"Password updated successfully",updatePass})
  }
  
} catch (error) {
  return res.status(500).json({message:error.message})
}

 
}
import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI
export const dbConnect = () =>
  mongoose.connect(
    MONGODB_URI
  ).then(()=>{
    console.log("Database connected successfully");
  }).catch(error=>{
    console.log(error.message);
  })

import mongoose from "mongoose";

export const dbConnect = () =>
  mongoose.connect(
    "mongodb+srv://mishrapriyanshu793:priyanshuabc@mycluster.7voxtp7.mongodb.net/blogApp"
  ).then(()=>{
    console.log("Database connected successfully");
  }).catch(error=>{
    console.log(error.message);
  })

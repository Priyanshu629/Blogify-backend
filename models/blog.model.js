import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    image:{
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
export const Blog = mongoose.model("Blog", BlogSchema);

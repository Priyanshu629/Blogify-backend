import { Blog } from "../models/blog.model.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

export const addBlog = async (req, res) => {
  const { title, body } = req.body;

  const postedBy = req.user.userId;

  if (title === "" || body === "") {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  if (req.file) {
    const image = await uploadToCloudinary(req.file.path);
    const blog = await Blog.create({ postedBy, title, body, image: image.url });
    return res.status(201).json({ message: "blog created successfully" });
  }

  const blog = await Blog.create({ postedBy, title, body, image: null });

  return res.status(201).json({ message: "blog created successfully" });
};

export const getBlogs = async (req, res) => {
  const blogs = await Blog.find({}).populate("postedBy");
  blogs.map((blog) => {
    blog.postedBy.password = undefined;
  });

  return res.status(200).json({ blogs });
};

export const getBlog = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId).populate("postedBy");
  blog.postedBy.password = undefined;

  return res.status(200).json({ blog });
};
export const deleteBlog = async (req, res) => {
  const { blogId, imageId } = req.params;

  await cloudinary.uploader.destroy(imageId);

  await Blog.findByIdAndDelete(blogId);

  return res.status(200).json({ message: "blog deleted successfully" });
};

export const updateBlog = async (req, res) => {
  const { title, body } = req.body;
  const { blogId } = req.params;
  //console.log(blogId,title,body);

  const blog = await Blog.findByIdAndUpdate(
    blogId,
    { title, body },
    { new: true }
  );

  return res
    .status(200)
    .json({ message: "blog updated successfully", updatedBlog: blog });
};

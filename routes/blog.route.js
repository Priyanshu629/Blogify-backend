import express from "express"
import { addBlog, getBlogs ,getBlog, deleteBlog,updateBlog} from "../controllers/blog.controller.js"
import { isAuthenticated } from "../middleware/auth.middleware.js"

const router = express.Router()

router.route("/create-blog").post(isAuthenticated,addBlog)
router.route("/get-blogs").get(getBlogs)
router.route("/get-blog/:blogId").get(getBlog)
router.route("/delete-blog/:blogId").delete(isAuthenticated,deleteBlog)
router.route("/update-blog/:blogId").put(isAuthenticated,updateBlog)





export default router
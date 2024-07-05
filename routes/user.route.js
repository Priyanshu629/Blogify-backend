import express from "express"
import { registerUser,loginUser ,getProfile, logout} from "../controllers/user.controller.js"
import {isAuthenticated} from "../middleware/auth.middleware.js"
import upload from "../middleware/multer.middleware.js"
const router = express.Router()

router.route("/register").post(upload.single("photo"),registerUser)
router.route("/login").post(loginUser)
router.route('/profile').get(isAuthenticated,getProfile)
router.route('/logout').post(logout)

export default router
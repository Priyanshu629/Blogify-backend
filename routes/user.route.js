import express from "express"
import { registerUser,loginUser ,getProfile, logout, forgetPassword, resetPassword} from "../controllers/user.controller.js"
import {isAuthenticated} from "../middleware/auth.middleware.js"
import upload from "../middleware/multer.middleware.js"
const router = express.Router()

router.route("/register").post(upload.single("photo"),registerUser)
router.route("/login").post(loginUser)
router.route('/profile').get(isAuthenticated,getProfile)
router.route('/logout').post(logout)
router.route('/forget-password').post(forgetPassword)
router.route('/reset-password').post(resetPassword)

export default router
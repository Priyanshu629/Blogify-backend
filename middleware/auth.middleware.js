
import jwt from "jsonwebtoken"
const jwtSecret = process.env.JWT_SECRET

export const isAuthenticated=(req,res,next)=>{

    const token = req.cookies.token
   
try {
    if(!token){
        return res.status(401).json({message:"You are not Loggedin"})
    }
    const isValidToken = jwt.verify(token,jwtSecret)

    if(!isValidToken){
        res.clearCookie("token",{
            httpOnly:true,
            secure:true,
            sameSite:"none"
        })
        
    }

    req.user = jwt.decode(token)
    next()
    
} catch (error) {
    return res.status(401).json({message:error.message})
}
    

    
}
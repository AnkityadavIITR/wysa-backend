import jwt from "jsonwebtoken";
import { config } from "dotenv";

export const sendCookies=(res,user,message,status)=>{
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
    res.status(status)
    .cookie("token",token,{
        httpOnly:true,
        maxAge:24*60*60*1000,
        sameSite:none,
        secure: true,
        path:"/"
    })
    .json({
      success:"true",
      message,
      user
    }
    );
}
import { Router } from "express";
const router=Router();
const loginScreenConfig = {
    heading: "Welcome to My App",
    backgroundColor: "#f0f0f0",
    Background : 'linear-gradient(239.26deg, #DDEEED 63.17%, #FDF1E0 94.92%)'
};

router.get("/login/config",(req,res)=>{
    console.log(loginScreenConfig);
    return res.json({
        success:true,
        config:loginScreenConfig
    })
})

export default router;
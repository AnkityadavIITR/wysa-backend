import express, { Router } from "express";
import bodyParser from "body-parser";

import { addNewUser, logInUser, logOutUser } from "../controllers/user.js";

const router=Router();
router.use(bodyParser.urlencoded({extended:true}));
router.use(express.json())

router.post("/register",addNewUser);
router.post("/login",logInUser)

export default router;
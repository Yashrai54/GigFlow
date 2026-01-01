import { Router } from "express";
import { handleSignIn, handleSignUp } from "../controllers/authController.js";

const authRouter = Router()

authRouter.post("/signup",handleSignUp)
authRouter.post("/signin",handleSignIn)

export default authRouter
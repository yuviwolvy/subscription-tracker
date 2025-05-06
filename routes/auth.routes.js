import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

//Basically the routes are just the enpoints that you can hit and the controllers form the logic that is executed once you hit those routes.
authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);

export default authRouter;

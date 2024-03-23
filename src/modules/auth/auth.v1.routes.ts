import { Router } from "express";
import {
  signupController,
  signupMiddleware,
} from "./controller/signup.controller";
import {
  loginController,
  loginMiddleware,
} from "./controller/login.controller";

const authRouter = Router();

authRouter.post("/v1/signup", signupMiddleware, signupController);
authRouter.post("/v1/login", loginMiddleware, loginController);

export { authRouter };

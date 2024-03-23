import { Express } from "express";
import { authRouter } from "../modules/auth/auth.v1.routes";

function routerV1(expressInstance: Express) {
  expressInstance.use("/", authRouter);
}

export default routerV1;

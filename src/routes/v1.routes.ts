import { Express } from "express";
import { authRouter } from "../modules/auth/auth.v1.routes";
import { productRouter } from "../modules/product/product.v1.routes";

function routerV1(expressInstance: Express) {
  expressInstance.use("/", authRouter);
  expressInstance.use("/", productRouter);
}

export default routerV1;

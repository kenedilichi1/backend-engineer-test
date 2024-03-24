import { Router } from "express";
import { multipleImagesMulterMiddleware } from "../../common/middleware/multer.service";
import {
  createProductController,
  createProductMiddleware,
} from "./controller/create-product.controller";

const productRouter = Router();

productRouter.post(
  "/v1/product",
  multipleImagesMulterMiddleware,
  createProductMiddleware,
  createProductController
);

export { productRouter };

import { Router } from "express";
import { multipleImagesMulterMiddleware } from "../../common/middleware/multer.service";
import {
  createProductController,
  createProductMiddleware,
} from "./controller/create-product.controller";
import {
  getProductsController,
  getProductsMiddleware,
} from "./controller/get-products.controller";

const productRouter = Router();

productRouter.get("/v1/products", getProductsMiddleware, getProductsController);

productRouter.post(
  "/v1/product",
  multipleImagesMulterMiddleware,
  createProductMiddleware,
  createProductController
);

export { productRouter };

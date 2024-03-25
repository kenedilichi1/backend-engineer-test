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
import {
  updateProductController,
  updateProductMiddleware,
} from "./controller/update-product.controller";
import {
  deleteProductController,
  deleteProductMiddleware,
} from "./controller/delete-product.controller";
import {
  getProductController,
  getProductMiddleware,
} from "./controller/get-product.controller";

const productRouter = Router();

productRouter.get("/v1/products", getProductsMiddleware, getProductsController);
productRouter.get(
  "/v1/product/:productId",
  getProductMiddleware,
  getProductController
);

productRouter.post(
  "/v1/product",
  multipleImagesMulterMiddleware,
  createProductMiddleware,
  createProductController
);

productRouter.put(
  "/v1/product/:productId",
  updateProductMiddleware,
  updateProductController
);

productRouter.delete(
  "/v1/product/:productId",
  deleteProductMiddleware,
  deleteProductController
);

export { productRouter };

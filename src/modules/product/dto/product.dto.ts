import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { HttpResponsePayload, PaginationCursor } from "../../../common/dtos";

export const ProductHttpInput = z.object({
  productName: z.string({ required_error: "product name is required" }),
  productPrice: z.string({ required_error: "product price is required" }),
  quantity: z
    .number({ required_error: "product quantity is required" })
    .positive(),
});
export type ProductHttpInput = z.infer<typeof ProductHttpInput>;

export const productHttpInput = zodToJsonSchema(ProductHttpInput);

export const ProductInput = ProductHttpInput.extend({
  userId: z.string(),
});
export type ProductInput = z.infer<typeof ProductInput>;

export const ProductDto = ProductInput.extend({
  productImages: z.string().array(),
});
export type ProductDto = z.infer<typeof ProductDto>;

export const CreateProduct = z.object({
  productId: z.string(),
});
export const createProductHttpRes = zodToJsonSchema(
  HttpResponsePayload.extend({ payload: CreateProduct })
);

export const Product = z.object({
  productName: z.string(),
  productImages: z.string().array(),
  productPrice: z.string(),
  quantity: z.number().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  productId: z.string(),
});
export type Product = z.infer<typeof Product>;

export const productsHttpRes = zodToJsonSchema(
  HttpResponsePayload.extend({
    payload: z.object({
      products: Product.array(),
      paginationCursor: PaginationCursor,
    }),
  })
);

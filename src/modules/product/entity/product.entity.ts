import { ObjectId } from "mongodb";
import { z } from "zod";
import { EntityStatus } from "../../../common/dtos";

export const ProductEntity = z.object({
  _id: z.instanceof(ObjectId),
  productName: z.string(),
  productImages: z.string().array(),
  productPrice: z.string(),
  quantity: z.number().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.instanceof(ObjectId),
  entityStatus: EntityStatus,
});
export type ProductEntity = z.infer<typeof ProductEntity>;

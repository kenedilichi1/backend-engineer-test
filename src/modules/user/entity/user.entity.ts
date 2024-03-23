import { ObjectId } from "mongodb";
import { z } from "zod";
import { EntityStatus } from "../../../common/dtos";

export const UserEntity = z.object({
  _id: z.instanceof(ObjectId),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  entityStatus: EntityStatus,
});
export type UserEntity = z.infer<typeof UserEntity>;

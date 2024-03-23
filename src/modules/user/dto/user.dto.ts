import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const User = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "email must be valid" }),

  password: z
    .string({ required_error: "password is required" })
    .min(8, "password must be a minimum of 8 characters"),

  name: z
    .string({ required_error: "name is required" })
    .min(3, "name can not be less than 3 characters"),
});

export type User = z.infer<typeof User>;
export const user = zodToJsonSchema(User);

import { z } from "zod";
import { HttpResponsePayload } from "../../../common/dtos";
import zodToJsonSchema from "zod-to-json-schema";

export const AuthDto = z.object({
  token: z.string(),
  userId: z.string(),
});
export type AuthDto = z.infer<typeof AuthDto>;

export const authHttpResponse = zodToJsonSchema(
  HttpResponsePayload.extend({
    payload: AuthDto,
  })
);

export const LoginDto = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "email must be valid" }),

  password: z
    .string({ required_error: "password is required" })
    .min(8, "password must be a minimum of 8 characters"),
});
export type LoginDto = z.infer<typeof LoginDto>;
export const loginSchema = zodToJsonSchema(LoginDto);

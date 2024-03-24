import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const EntityStatusOptions = z.enum([
  "DELETED",
  "PENDING",
  "ACTIVE",
  "APPROVED",
  "COMPLETED",
  "SUSPENDED",
]);

export type EntityStatusOptions = z.infer<typeof EntityStatusOptions>;

export const EntityStatusReason = z.object({
  reasonId: z.string().trim().optional(),
  text: z.string().trim().optional(),
  custom: z.string().trim().nullish(),
});
export type EntityStatusReason = z.infer<typeof EntityStatusReason>;

export const EntityStatus = z.object({
  status: z.any(),
  by: z.string().min(5).nullish(),
  reason: EntityStatusReason.nullish(),
  at: z.date().default(new Date()),
});

export type EntityStatus = z.infer<typeof EntityStatus>;

export const JwtFor = z.enum(["authorized", "authenticated"]);
export type JwtFor = z.infer<typeof JwtFor>;

export const HttpResponsePayload = z.object({
  isError: z.boolean(),
  context: z.string().default("OK"),
  message: z.string().optional(),
});

export const httpErrorResponse = zodToJsonSchema(
  HttpResponsePayload.extend({
    description: z.string().nullable(),
    payload: z.string().nullable().default(null),
  })
);

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const JWTVerificationPayload = z.object({
  userId: z.string(),
  jwtFor: JwtFor,
});
export type JWTVerificationPayload = z.infer<typeof JWTVerificationPayload>;

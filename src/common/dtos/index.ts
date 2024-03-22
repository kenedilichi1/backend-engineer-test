import { z } from "zod";

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

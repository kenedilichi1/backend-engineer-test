"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationCursor = exports.paginationInputSchema = exports.JWTVerificationPayload = exports.ACCEPTED_IMAGE_TYPES = exports.httpErrorResponse = exports.HttpResponsePayload = exports.JwtFor = exports.EntityStatus = exports.EntityStatusReason = exports.EntityStatusOptions = void 0;
var zod_1 = require("zod");
var zod_to_json_schema_1 = require("zod-to-json-schema");
exports.EntityStatusOptions = zod_1.z.enum([
    "DELETED",
    "PENDING",
    "ACTIVE",
    "APPROVED",
    "COMPLETED",
    "SUSPENDED",
]);
exports.EntityStatusReason = zod_1.z.object({
    reasonId: zod_1.z.string().trim().optional(),
    text: zod_1.z.string().trim().optional(),
    custom: zod_1.z.string().trim().nullish(),
});
exports.EntityStatus = zod_1.z.object({
    status: zod_1.z.any(),
    by: zod_1.z.string().min(5).nullish(),
    reason: exports.EntityStatusReason.nullish(),
    at: zod_1.z.date().default(new Date()),
});
exports.JwtFor = zod_1.z.enum(["authorized", "authenticated"]);
exports.HttpResponsePayload = zod_1.z.object({
    isError: zod_1.z.boolean(),
    context: zod_1.z.string().default("OK"),
    message: zod_1.z.string().optional(),
});
exports.httpErrorResponse = (0, zod_to_json_schema_1.default)(exports.HttpResponsePayload.extend({
    description: zod_1.z.string().nullable(),
    payload: zod_1.z.string().nullable().default(null),
}));
exports.ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
exports.JWTVerificationPayload = zod_1.z.object({
    userId: zod_1.z.string(),
    jwtFor: exports.JwtFor,
});
exports.paginationInputSchema = zod_1.z.object({
    before: zod_1.z.string().optional(),
    after: zod_1.z.string().optional(),
    limit: zod_1.z.number().default(10),
});
exports.PaginationCursor = zod_1.z.object({
    before: zod_1.z.string(),
    after: zod_1.z.string(),
    hasNext: zod_1.z.boolean(),
    hasPrevious: zod_1.z.boolean(),
});

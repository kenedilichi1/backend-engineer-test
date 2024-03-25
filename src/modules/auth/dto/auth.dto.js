"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.LoginDto = exports.authHttpResponse = exports.AuthDto = void 0;
var zod_1 = require("zod");
var dtos_1 = require("../../../common/dtos");
var zod_to_json_schema_1 = require("zod-to-json-schema");
exports.AuthDto = zod_1.z.object({
    token: zod_1.z.string(),
    userId: zod_1.z.string(),
});
exports.authHttpResponse = (0, zod_to_json_schema_1.default)(dtos_1.HttpResponsePayload.extend({
    payload: exports.AuthDto,
}));
exports.LoginDto = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: "email is required" })
        .email({ message: "email must be valid" }),
    password: zod_1.z
        .string({ required_error: "password is required" })
        .min(8, "password must be a minimum of 8 characters"),
});
exports.loginSchema = (0, zod_to_json_schema_1.default)(exports.LoginDto, { name: "loginSchema" });

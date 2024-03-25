"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.User = void 0;
var zod_1 = require("zod");
var zod_to_json_schema_1 = require("zod-to-json-schema");
exports.User = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: "email is required" })
        .email({ message: "email must be valid" }),
    password: zod_1.z
        .string({ required_error: "password is required" })
        .min(8, "password must be a minimum of 8 characters"),
    name: zod_1.z
        .string({ required_error: "name is required" })
        .min(3, "name can not be less than 3 characters"),
});
exports.user = (0, zod_to_json_schema_1.default)(exports.User);

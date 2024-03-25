"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletedResponse = exports.DeleteResponse = exports.updateResponse = exports.UpdateResponse = exports.UpdateQueryDto = exports.updateQuery = exports.UpdateQuery = exports.productsHttpRes = exports.product = exports.Product = exports.createProductHttpRes = exports.CreateProduct = exports.ProductDto = exports.ProductInput = exports.productHttpInput = exports.ProductHttpInput = void 0;
var zod_1 = require("zod");
var zod_to_json_schema_1 = require("zod-to-json-schema");
var dtos_1 = require("../../../common/dtos");
exports.ProductHttpInput = zod_1.z.object({
    productName: zod_1.z.string({ required_error: "product name is required" }),
    productPrice: zod_1.z.string({ required_error: "product price is required" }),
    quantity: zod_1.z
        .number({ required_error: "product quantity is required" })
        .positive(),
});
exports.productHttpInput = (0, zod_to_json_schema_1.default)(exports.ProductHttpInput);
exports.ProductInput = exports.ProductHttpInput.extend({
    userId: zod_1.z.string(),
});
exports.ProductDto = exports.ProductInput.extend({
    productImages: zod_1.z.string().array(),
});
exports.CreateProduct = zod_1.z.object({
    productId: zod_1.z.string(),
});
exports.createProductHttpRes = (0, zod_to_json_schema_1.default)(dtos_1.HttpResponsePayload.extend({ payload: exports.CreateProduct }));
exports.Product = zod_1.z.object({
    productName: zod_1.z.string(),
    productImages: zod_1.z.string().array(),
    productPrice: zod_1.z.string(),
    quantity: zod_1.z.number().positive(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    userId: zod_1.z.string(),
    productId: zod_1.z.string(),
});
exports.product = (0, zod_to_json_schema_1.default)(dtos_1.HttpResponsePayload.extend({ payload: exports.Product }));
exports.productsHttpRes = (0, zod_to_json_schema_1.default)(dtos_1.HttpResponsePayload.extend({
    payload: zod_1.z.object({
        products: exports.Product.array(),
        paginationCursor: dtos_1.PaginationCursor,
    }),
}));
exports.UpdateQuery = zod_1.z.object({
    productPrice: zod_1.z.string().optional(),
    quantity: zod_1.z.number().optional(),
});
exports.updateQuery = (0, zod_to_json_schema_1.default)(exports.UpdateQuery);
exports.UpdateQueryDto = exports.UpdateQuery.extend({
    productId: zod_1.z.string(),
});
exports.UpdateResponse = zod_1.z.object({
    updated: zod_1.z.boolean(),
});
exports.updateResponse = (0, zod_to_json_schema_1.default)(dtos_1.HttpResponsePayload.extend({ payload: exports.UpdateResponse }));
exports.DeleteResponse = zod_1.z.object({
    deleted: zod_1.z.boolean(),
});
exports.deletedResponse = (0, zod_to_json_schema_1.default)(dtos_1.HttpResponsePayload.extend({ payload: exports.DeleteResponse }));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_NAME = exports.JWT_SECRET = exports.DATABASE_URI = exports.PORT = exports.isDevelopment = exports.isTest = exports.NODE_ENV = exports.environments = void 0;
var dotenv = require("dotenv");
exports.environments = {
    development: "development",
    test: "test",
};
process.env.NODE_ENV =
    exports.environments[process.env.NODE_ENV || "development"];
exports.NODE_ENV = exports.environments[process.env.NODE_ENV || "development"];
var isTest = function (environment) {
    return ["testing", "test"].includes(environment);
};
exports.isTest = isTest;
var isDevelopment = function (environment) {
    return ["dev", "development"].includes(environment);
};
exports.isDevelopment = isDevelopment;
var envFile = ".env.".concat(process.env.NODE_ENV);
dotenv.config({ path: envFile });
exports.PORT = (process === null || process === void 0 ? void 0 : process.env.PORT) || 3000;
exports.DATABASE_URI = process.env.DB_URI;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.DB_NAME = "backend-engineer-".concat(exports.NODE_ENV);

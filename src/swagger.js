"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var swagger_autogen_1 = require("swagger-autogen");
var config_1 = require("./common/config");
var user_dto_1 = require("./modules/user/dto/user.dto");
var auth_dto_1 = require("./modules/auth/dto/auth.dto");
var dtos_1 = require("./common/dtos");
var product_dto_1 = require("./modules/product/dto/product.dto");
var version = require("../package.json").version;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var outputFile, endpoints, host, schemes, doc, swaggerOptions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                outputFile = "./swagger-output.json";
                endpoints = [
                    // `${__dirname}/server.js`,
                    "".concat(__dirname, "/modules/auth/auth.v1.routes.js"),
                    "".concat(__dirname, "/modules/product/product.v1.routes.js"),
                ];
                host = "localhost:".concat(config_1.PORT);
                schemes = ["http"];
                if ((0, config_1.isTest)(config_1.NODE_ENV)) {
                    host = "localhost:".concat(config_1.PORT);
                    schemes = ["http"];
                }
                doc = {
                    info: {
                        title: "BACKEND ENGINEER TEST API Documentation",
                        description: "APIs for backend engineer test",
                        version: version,
                    },
                    host: host,
                    schemes: schemes,
                    consumes: ["application/json"],
                    produces: ["application/json"],
                    securityDefinitions: {
                        token: {
                            type: "apiKey",
                            in: "header", // can be 'header', 'query' or 'cookie'
                            name: "X-API-KEY", // name of the header, query parameter or cookie
                            description: "API token",
                        },
                    },
                    parameters: {},
                    "@definitions": {
                        authHttpResponse: auth_dto_1.authHttpResponse,
                        createProductHttpRes: product_dto_1.createProductHttpRes,
                        deletedResponse: product_dto_1.deletedResponse,
                        httpErrorResponse: dtos_1.httpErrorResponse,
                        loginSchema: auth_dto_1.loginSchema,
                        product: product_dto_1.product,
                        productHttpInput: product_dto_1.productHttpInput,
                        productsHttpRes: product_dto_1.productsHttpRes,
                        user: user_dto_1.user,
                        updateResponse: product_dto_1.updateResponse,
                        updateQuery: product_dto_1.updateQuery,
                    },
                };
                swaggerOptions = {
                    openapi: null,
                    language: "en-US",
                    autoHeaders: false,
                    autoQuery: false,
                    autoBody: false,
                };
                return [4 /*yield*/, (0, swagger_autogen_1.default)(swaggerOptions)(outputFile, endpoints, doc)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();

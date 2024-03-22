import swaggerAutogen from "swagger-autogen";
import { isTest, NODE_ENV, PORT } from "./common/config";

const { version } = require("../package.json");

(async () => {
  const outputFile = "./swagger-output.json";

  const endpoints: string[] = [
    // `${__dirname}/server.js`,
  ];

  let host: string = `localhost:${PORT}`;
  let schemes: string[] = ["http"];

  if (isTest(NODE_ENV)) {
    host = `localhost:${PORT}`;
    schemes = ["http"];
  }

  const doc = {
    info: {
      title: "BACKEND ENGINEER TEST API Documentation",
      description: "APIs for backend engineer test",
      version,
    },
    host,
    schemes,
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
    "@definitions": {},
  };

  const swaggerOptions = {
    openapi: null,
    language: "en-US",
    autoHeaders: false,
    autoQuery: false,
    autoBody: false,
  };

  await swaggerAutogen(swaggerOptions)(outputFile, endpoints, doc);
})();

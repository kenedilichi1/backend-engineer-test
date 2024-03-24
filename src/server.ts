import { Express, Request, Response, NextFunction } from "express";
import { errorResponder } from "./utils/http-responder";
import { Errors } from "./utils/error";
import routerV1 from "./routes/v1.routes";
const swaggerUi = require("swagger-ui-express");

const swaggerOutputFile = require("./swagger-output.json");

export function server(app: Express) {
  // ---
  app.get("/api-docs/swagger.json", (_request, response) => {
    console.log(swaggerOutputFile);
    response.json(swaggerOutputFile);
  });

  const swaggerUiOptions = {
    explorer: false,
    deepLinking: true,
    displayOperationId: true,
    customCss: ".errors-wrapper {display: none!important;}",
    syntaxHighlight: { theme: "obsidian" },
  };
  app.use(
    "/doc",
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutputFile, swaggerUiOptions)
  );

  routerV1(app);

  app.use(
    (
      error: Errors | any,
      _request: Request,
      response: Response,
      _next: NextFunction
    ) => {
      console.log(error, ">>> error");

      return errorResponder(response, error);
    }
  );

  return app;
}

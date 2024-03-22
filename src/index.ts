import http from "http";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import { mongoDbClient } from "./common/database/mongo-client";
import { PORT } from "./common/config";
import { server } from "./server";

const expressInstance: Express = express();

(async (app: Express) => {
  try {
    const mongoClient = mongoDbClient();
    const databaseConnection = await mongoClient.connect();
    const mongoDbInstance = mongoClient.db("backend-engineer");

    app.locals.mongoDbInstance = mongoDbInstance;

    app.use(helmet());

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use(compression());

    app.use(cors());

    server(app);

    const httpServer = http.createServer(app);

    httpServer.listen(PORT, () => {
      console.log(`API endpoint = http://localhost:${PORT}`);
      console.log(`Documentation endpoint = http://localhost:${PORT}/doc`);
      console.log(
        `Swagger File = http://localhost:${PORT}/api-docs/swagger.json`
      );
      console.info(`Server started on port ${PORT}`);
    });

    function gracefulShutdown() {
      httpServer.close(async () => {
        console.log("server is closing....");
        await databaseConnection.close();
        console.log("Database closed..");
        process.exit(0);
      });
    }

    process.on("SIGINT", gracefulShutdown);

    process.on("SIGTERM", gracefulShutdown);

    process.on("uncaughtEcxeption", (error) => {
      console.log("--- Uncaught exception ---");
      console.error(error);
      console.log("*** Uncaught exception ***");
      gracefulShutdown();
    });

    process.on("SIGHUP", () => {
      console.info("SIGHUP recieved");
    });
  } catch (error) {
    console.log(error);
  }
})(expressInstance);

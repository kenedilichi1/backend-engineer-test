import { MongoClient } from "mongodb";
import { DATABASE_URI } from "../config";

export const mongoDbClient = (): MongoClient => {
  const dbURI = DATABASE_URI as string;

  const options = {
    retryWrites: true,
    appName: "Engineer_Test",
  };

  const client = new MongoClient(dbURI, options);

  return client;
};

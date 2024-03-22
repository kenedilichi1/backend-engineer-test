const dotenv = require("dotenv");

export const environments = {
  development: "development",
  test: "test",
} as const;

export type EnvironmentKeys = keyof typeof environments;
export type Environments = (typeof environments)[EnvironmentKeys];

process.env.NODE_ENV =
  environments[(process.env.NODE_ENV as EnvironmentKeys) || "development"];

export const isTest = (environment: Environments): boolean =>
  ["testing", "test"].includes(environment);

export const isDevelopment = (environment: Environments): boolean =>
  ["dev", "development"].includes(environment);

const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envFile });

export const PORT = process?.env.PORT || 3000;
export const DATABASE_URI = process.env.DB_URI;

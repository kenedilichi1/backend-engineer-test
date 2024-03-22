// import { ZodIssue } from "zod";

export type Errors = {
  name: ErrorName;
  message: string;
  cause: string;
  code: number;
  stack?: string;
};

export type ErrorName =
  | "SERVER_ERROR"
  | "USER_ERROR"
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "NOT_FOUND"
  | "DATABASE_ERROR"
  | "NOT_IMPLEMENTED";

export const criticalErrors = [
  "SERVER_ERROR",
  "DATABASE_ERROR",
  "NOT_IMPLEMENTED",
  "ReferenceError",
  "MongoError",
];

const defaultErrorMessage = (name: ErrorName) => {
  switch (name) {
    case "USER_ERROR":
    case "VALIDATION_ERROR":
      return "Bad request. Check that you are sending the right data.";
    case "AUTHENTICATION_ERROR":
      return "Invalid authentication credentials";
    case "NOT_FOUND":
      return "The resources you request for was not found.";
    case "DATABASE_ERROR":
    case "SERVER_ERROR":
    case "NOT_IMPLEMENTED":
      return "We messed up on our end. We are working to fix this.";
    default:
      return "Something went wrong reach out to suport for help.";
  }
};

const errorCode = (name: ErrorName) => {
  switch (name) {
    case "USER_ERROR":
    case "VALIDATION_ERROR":
      return 400;
    case "AUTHENTICATION_ERROR":
      return 401;
    case "NOT_FOUND":
      return 404;
    case "DATABASE_ERROR":
    case "SERVER_ERROR":
    case "NOT_IMPLEMENTED":
      return 500;
    default:
      return 400;
  }
};

/**
 * [See Article](https://engineering.udacity.com/handling-errors-like-a-pro-in-typescript-d7a314ad4991)
 */
export class ErrorBase<T extends string> extends Error {
  name: T | string;
  message: string;
  cause: any;
  code: number;

  constructor(error: Errors) {
    super();

    this.name = error.name;
    this.message = error.message;
    this.cause = error.cause;
    this.code = error.code;
    this.stack = error.stack ?? error.cause;
  }
}

export class Exception extends ErrorBase<ErrorName> {
  constructor(name: ErrorName, message?: string, cause?: string) {
    super({
      name,
      message: message ? message : defaultErrorMessage(name),
      cause: cause ? cause : message ? message : defaultErrorMessage(name),
      code: errorCode(name),
      stack: cause ? cause : message ? message : defaultErrorMessage(name),
    });
  }
}

// export function parseZodError(issues: ZodIssue[]) {
// 	const numberOfIssues = issues.length;
// 	let str = '';
// 	for (let i = 0; i < numberOfIssues; i++) {
// 		str = `${str} ${issues[i]['message']} at "${issues[i]['path'][0]}";`;
// 	}

// 	return str;
// }

import jwt from "jsonwebtoken";
import { Request } from "express";
import { JWT_SECRET } from "../common/config";
import { Exception } from "./error";
import { JWTVerificationPayload } from "../common/dtos";

export function VerifyJWT(request: Request): JWTVerificationPayload {
  try {
    const token = String(request.headers["x-api-key"]);

    const key = `${JWT_SECRET}`;

    const data = jwt.verify(token, key);

    if (typeof data === "string") {
      throw new Exception(
        "AUTHENTICATION_ERROR",
        "Invalid token. You credentials must have expired. Try loging in again."
      );
    }

    return {
      userId: data.userId,
      jwtFor: data.jwtFor,
    };
  } catch (error) {
    console.error(error, "jwt verification");
    throw new Exception(
      "AUTHENTICATION_ERROR",
      "Could not verify credentials. Try login in again."
    );
  }
}

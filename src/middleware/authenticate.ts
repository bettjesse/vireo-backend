import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { UNAUTHORIZED } from "../constants/http";
import { verifyToken } from "../utils/jwt";
import mongoose from "mongoose";

// wrap with catchErrors() if you need this to be async
const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );
// Ensure the types are ObjectId

  // Assert the types of userId and sessionId
  req.userId = new mongoose.Types.ObjectId(payload.userId as string);  // Assert payload.userId to string
  req.sessionId = new mongoose.Types.ObjectId(payload.sessionId as string);  
//   req.userId  = payload.userId;
//   req.sessionId  = payload.sessionId;
  next();
};

export default authenticate;
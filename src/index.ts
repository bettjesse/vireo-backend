import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { dbConnection } from "./db/dbConnection ";
import { APP_ORIGIN } from "./constants/env";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/auth.route";
import authenticate from "./middleware/authenticate";
import userRoutes from "./routes/user.route";
import sessionRoutes from "./routes/session.route";

// Initialize the app
const app = express();


// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/auth", authRoutes)
app.use("/user", authenticate, userRoutes)
app.use("/sessions", authenticate, sessionRoutes)

app.use(errorHandler)

// Start the server first
app.listen(7000, async() => {
  console.log("Server started on localhost:7000");


  await dbConnection();
});

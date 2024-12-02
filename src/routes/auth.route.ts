
import { Router } from "express";
import { registerController, loginController, logoutController, refresController } from "../controllers/auth.controller";


const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.get("/refresh", refresController)
authRoutes.get("/logout", logoutController);
export default authRoutes
import { RequestHandler, Router } from "express";
import { signup, login, checkAuth } from "../controllers/auth.controllers";

const authRoutes = Router();

authRoutes.post("/signup", signup as RequestHandler);
authRoutes.get("/login", login as RequestHandler);
authRoutes.get("/checkAuth", checkAuth as RequestHandler);


export default authRoutes;
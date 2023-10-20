import express, { Router } from "express";
import { body } from "express-validator";
import { User } from "../models/auth.model";
import { verifyAccessToken } from "../utils/jwt.service";
import { getInfo } from "../controllers/user.controller";

const userRoute: Router = express.Router();

userRoute.get("/get-info", verifyAccessToken, getInfo);

export default userRoute;

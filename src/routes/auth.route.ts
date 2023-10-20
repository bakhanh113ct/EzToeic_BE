import express, { Router } from "express";
import { User } from "../models/auth.model";
import { signUp, signIn } from "../controllers/auth.controller";
import { body } from "express-validator";

const authRoute: Router = express.Router();

authRoute.put(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({
          where: {
            email: value,
          },
        }).then((result) => {
          if (result) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  signUp
);

authRoute.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({
          where: {
            email: value,
          },
        }).then((result) => {
          if (!result) {
            return Promise.reject("E-Mail address not exists!");
          }
        });
      })
      .normalizeEmail(),
  ],
  signIn
);

// authRoute.get('')

export default authRoute;

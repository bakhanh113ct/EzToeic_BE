import { validationResult } from "express-validator";
import { User } from "../models/auth.model";
import { ErrorResp, Errors } from "../helpers/error";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
} from "../utils/jwt.service";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { client } from "../configs/redis";
dotenv.config();

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new ErrorResp("error.badRequest", "Validation Failed", 422);
    error.data = errors.array();
    return next(error);
  }
  const user = User.create(req.body);

  // const email = req.body.email;
  // const name = req.body.name;
  // const password = req.body.password;
  // const dateOfBirth = req.body.dateOfBirth;
  // const phone = req.body.phone;
  // const isAdmin = req.body.isAdmin;

  bcrypt.hash(req.body.password, 12).then(async (hashedPw) => {
    // user.email = email;
    // user.name = name;
    user.password = hashedPw;
    // user.dateOfBirth = dateOfBirth;
    // user.phone = phone;
    // user.isAdmin = isAdmin;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    try {
      await user.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(422).json(err);
    }
  });
};

const signIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new ErrorResp("error.badRequest", "Validation Failed", 422);
    error.data = errors.array();
    return next(error);
  }
  const email = req.body.email;
  const password = req.body.password;

  const user: User = await User.findOne({
    where: {
      email: email,
    },
  });

  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      console.log("same");
      const token = signAccessToken(user);
      const refreshToken = await signRefreshToken(user);
      return res.status(200).json({
        accessToken: token,
        refreshToken: refreshToken,
        user: user,
      });
    } else {
      console.log("not same");
      return next(Errors.wrongPassword);
    }
  }

};

const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.body.token;

  if (!token) {
    return next(Errors.BadRequest);
  }

  try {
    const user = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (user === undefined || typeof user === "string") {
      console.log("he");
      return res.json("a");
    } else {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      const newRefreshToken = jwt.sign(
        {
          email: user.email,
          userId: user.userId,
          isAdmin: user.isAdmin,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({
        message: "Success",
        accessToken: token,
        refreshToken: newRefreshToken,
        userId: user.userId,
      });
    }
  } catch (error) {
    return res.status(400).send("Invalid token!");
  }
};

export { signUp, signIn, refreshTokenController };

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/auth.model";
import { client } from "../configs/redis";
import { NextFunction, Request, Response } from "express";
import { ErrorResp, Errors } from "../helpers/error";

dotenv.config();

interface JwtPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
}

const signAccessToken = (user: User) => {
  const token = jwt.sign(
    {
      email: user.email,
      userId: user.id,
      isAdmin: user.isAdmin,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return token;
};

const signRefreshToken = async (user: User) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        email: user.email,
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1y" },
      async (err, token) => {
        if (err) {
          return reject(err);
        }
        await client
          .set(user.email, token!, {
            EX: 365 * 24 * 60 * 60,
          })
          .catch((err) => {
            reject(err);
          });
        resolve(token);
      }
    );
  });
};

const verifyAdminAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return next(Errors.BadRequest);
  }

  // Get token from header
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  // start verify token
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
    (err, payload: JwtPayload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return next(Errors.Unauthorized);
        }
        return next(Errors.Unauthorized);
      }

      if (!payload.isAdmin) {
        const error = new ErrorResp(
          "error.badRequest",
          "You don't have a permission to do this task",
          400
        );
        return next(error);
      }

      // Pass payload to next midleware
      req.auth = payload;
      next();
    }
  );
};

const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return next(Errors.BadRequest);
  }

  // Get token from header
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  // start verify token
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
    (err, payload: JwtPayload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return next(Errors.Unauthorized);
        }
        return next(Errors.Unauthorized);
      }

      // Pass payload to next midleware
      req.auth = payload;
      next();
    }
  );
};

const verifyRefreshToken = (refreshToken: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      async (err, payload) => {
        if (err) {
          return reject(err);
        }
        if (payload === undefined || typeof payload === "string") {
          // return reject(createError.BadRequest('Missing payload in token'));
          return reject(Errors.BadRequest);
        }

        // Get RK from redis
        const RK = await client.get(payload.user.mail);
        if (RK === null) {
          // reject(createError.NotAcceptable('Our system does not have your refresh token'));
          return reject(Errors.Unauthorized);
        }
        if (RK !== refreshToken) {
          // reject(createError.Unauthorized('Invalid refresh token'));
          return reject(Errors.Unauthorized);
        }

        resolve(payload);
      }
    );
  });
};

export {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyAdminAccessToken,
};

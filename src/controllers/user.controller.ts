import { NextFunction, Request, Response } from "express";
import { User } from "../models/auth.model";

const getInfo = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.auth.userId;

  let user: User;

  user = await User.findOne({ where: { id: id } });

  const {
    isAdmin: _,
    createdAt: __,
    updatedAt: ___,
    password: ____,
    ...result
  } = user;

  return res.json(result);
};

export { getInfo };

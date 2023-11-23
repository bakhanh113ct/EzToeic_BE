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

const updateInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { name, dob, phone } = req.body;
  console.log(name);
  const user = await User.findOne({ where: { id: Number(req.auth.userId) } });

  console.log(new Date(dob));

  user.name = name ?? user.name;
  user.updatedAt = new Date(dob);
  user.phone = phone ?? user.phone;

  try {
    await user.save();
    return res.json({
      message: "Update successful",
    });
  } catch (err) {
    return res.json(err);
  }
};

export { getInfo, updateInfo };

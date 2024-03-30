import { Response, Request, NextFunction } from "express";
import { dataToInsert, UserResponse } from "@repo/types";
import UserSchema from "../model/user.schema";

const verifyAdmin = async (
  req: Request & dataToInsert,
  res: Response<UserResponse>,
  next: NextFunction,
) => {
  const user = await UserSchema.findOne({ email: req.email })
    .select("roles")
    .lean()
    .exec();

  if (!user) {
    return res.status(500).send({ success: false, message: "Database Sucks" });
  }
  const inDBTrue = user.roles.includes("admin");
  if (!req.roles?.includes("admin") || !inDBTrue) {
    return res
      .status(401)
      .send({ success: false, message: "Unauthorized|Not a Admin" });
  }
  next();
};

export { verifyAdmin };

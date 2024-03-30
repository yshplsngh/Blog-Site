import { Request, Response } from "express";
import { returnMsg } from "../utils/ResponseHandler";
import {
  dataToInsert,
  UserResponse,
  changePasswordType,
  updateProfileType,
} from "@repo/types";
import UserSchema from "../model/user.schema";
import { userLogger } from "../middleware/logger";
import bcrypt from "bcrypt";

// @desc update personal profile like-name
// @route PATCH api/v1/user/updateProfile
// @access Private
const updateProfile = async (
  req: Request & dataToInsert,
  res: Response<UserResponse>,
) => {
  const isValid = updateProfileType.safeParse(req.body);
  if (!isValid.success) {
    const reply: string = returnMsg(isValid);
    return res.status(401).send({ success: false, message: reply });
  }
  const user = await UserSchema.findById(isValid.data.mId).exec();
  if (!user) {
    return res.status(400).send({ success: false, message: "User not found" });
  }
  user.name = isValid.data.name;
  await user.save();

  const reply: string = `Username ${user.name} with ID ${user._id} updated his profile`;
  userLogger(req.email, reply);
  res.status(200).send({ success: true, message: reply });
};

// @desc change password
// @route PATCH api/v1/user/changePassword
// @access Private
const changePassword = async (
  req: Request & dataToInsert,
  res: Response<UserResponse>,
) => {
  const isValid = changePasswordType.safeParse(req.body);
  if (!isValid.success) {
    const reply: string = returnMsg(isValid);
    return res.status(401).send({ success: false, message: reply });
  }
  const user = await UserSchema.findById(isValid.data.mId).exec();
  if (!user) {
    return res.status(400).send({ success: false, message: "User not found" });
  }

  const match: boolean = await bcrypt.compare(
    isValid.data.oldPassword,
    user.password,
  );
  if (!match) {
    return res
      .status(401)
      .send({ success: false, message: "incorrect old password" });
  }

  user.password = await bcrypt.hash(isValid.data.password, 10);
  await user.save();

  const reply: string = `Username ${user.name} with ID ${user._id} updated his password`;
  userLogger(req.email, reply);
  res.status(200).send({ success: true, message: reply });
};
export { updateProfile, changePassword };

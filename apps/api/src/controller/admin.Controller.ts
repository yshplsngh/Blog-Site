import UserSchema from "../model/user.schema";
import { Request, Response } from "express";
import { dataToInsert, UserResponse } from "../types/globalTypes";
import { adminLogger } from "../middleware/logger";
import { isId } from "../types/noteTypes";
import { returnMsg } from "../utils/ResponseHandler";
import { updateInfoType } from "../types/adminTypes";
import NoteSchema from "../model/note.schema";
import { isEmail } from "../types/authTypes";

// @desc get all users
// @route GET api/v1/admin/users
// @access private

const getUsers = async (
  req: Request & dataToInsert,
  res: Response<UserResponse>,
) => {
  const users = await UserSchema.find({ email: { $ne: req.email } })
    .select("-password")
    .lean();

  if (!users?.length) {
    return res.status(400).send({ success: false, message: "no users found" });
  }
  adminLogger(req.email, "requested all user");
  return res.status(200).send({ success: true, message: users });
};

// @desc update user info
// @route PATCH api/v1/admin/users
// @access Private
const updateUserData = async (
  req: Request & dataToInsert,
  res: Response<UserResponse>,
) => {
  const isValid = updateInfoType.safeParse(req.body);
  if (!isValid.success) {
    const msg: string = returnMsg(isValid);
    return res.status(422).send({ success: false, message: msg });
  }
  const user = await UserSchema.findById(isValid.data.id).exec();
  if (!user) {
    return res.status(400).send({ success: false, message: "User not found" });
  }
  user.email = isValid.data.email;
  user.name = isValid.data.name;
  user.isActive = isValid.data.isActive;
  user.roles = isValid.data.roles;

  await user.save();
  const reply: string = `Username ${user.name} with ID ${user._id} updated successfully`;
  adminLogger(req.email, reply);
  res.status(200).send({ success: true, message: reply });
};

// @desc delete a user
// @route DELETE api/v1/admin/users
// @access Private
const deleteUser = async (
  req: Request & dataToInsert,
  res: Response<UserResponse>,
) => {
  if (!req.roles?.includes("admin")) {
    return res
      .status(401)
      .send({ success: false, message: "Unauthorized|Not a Admin" });
  }
  const isValid = isId.safeParse(req.body);
  if (!isValid.success) {
    const msg: string = returnMsg(isValid);
    return res.status(422).send({ success: false, message: msg });
  }
  const user = await UserSchema.findById(isValid.data.id).exec();
  if (!user) {
    return res.status(400).send({ success: false, message: "User not found" });
  }

  await user.deleteOne();
  const reply: string = `Username ${user.name} with ID ${user._id} deleted`;
  adminLogger(req.email, reply);
  res.status(200).send({ success: true, message: reply });
  // res.status(400).send({success:false,message:'my cutom error'});
};

export { getUsers, deleteUser, updateUserData };

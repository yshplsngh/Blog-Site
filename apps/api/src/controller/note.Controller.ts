import { Response, Request } from "express";
import {
  EOCNoteFormSchema,
  EOCNoteFormSchemaWithId,
  isId,
  dataToInsert,
  UserResponse,
  isEmail,
} from "@repo/types";
import UserSchema from "../model/user.schema";
import NoteSchema, { noteModel } from "../model/note.schema";
import { returnMsg } from "../utils/ResponseHandler";

// @desc create new note
// @route POST api/v1/note/createNote
// @access private
const createNote = async (
  req: Request & dataToInsert,
  res: Response<UserResponse>,
) => {
  const isValid = EOCNoteFormSchema.safeParse(req.body);
  if (!isValid.success) {
    const msg: string = returnMsg(isValid);
    return res.status(422).send({ success: false, message: msg });
  }
  const found = await UserSchema.findOne({ email: req.email })
    .select(["_id", "name"])
    .lean()
    .exec();
  if (!found) {
    return res.status(401).send({ success: false, message: "user not found" });
  }
  const payload: noteModel = {
    user: found._id,
    title: isValid.data.title,
    desc: isValid.data.desc,
  };
  const result = await NoteSchema.create(payload);
  if (result) {
    await UserSchema.findByIdAndUpdate(
      found._id,
      { $push: { notes: result._id } },
      { new: true },
    )
      .lean()
      .exec();
    res
      .status(201)
      .send({ success: true, message: `${found.name} your notes created` });
  } else {
    res.status(401).send({ success: false, message: "something wrong happen" });
  }
};

// @desc get all notes
// @route GET api/v1/note/getAllNotes
// @access private
const getAllNotes = async (
  req: Request & dataToInsert,
  res: Response<UserResponse>,
) => {
  const isValid = isEmail.safeParse(req.body);
  if (!isValid.success) {
    const msg: string = returnMsg(isValid);
    return res.status(422).send({ success: false, message: msg });
  }

  /*here we need _id to get all notes of that user*/
  const found = await UserSchema.findOne({ email: isValid.data.email })
    .select("_id")
    .lean()
    .exec();
  if (!found) {
    return res.status(401).send({ success: false, message: "user not found" });
  }

  const notes = await NoteSchema.find({ user: found._id }).lean().exec();

  /* no use, but just for shake learn use of Promise.all, so here i am adding email to each note*/
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const userData = await UserSchema.findById(note.user)
        .select("email")
        .lean()
        .exec();
      return { ...note, email: userData?.email };
    }),
  );
  res.status(200).send({ success: true, message: notesWithUser });
};

// @desc update title,desc
// @route PATCH api/v1/note/updateNote
// @access private
const updateNote = async (
  req: Request & dataToInsert,
  res: Response<UserResponse>,
) => {
  const isValid = EOCNoteFormSchemaWithId.safeParse(req.body);
  if (!isValid.success) {
    const msg: string = returnMsg(isValid);
    return res.status(422).send({ success: false, message: msg });
  }
  const note = await NoteSchema.findById(isValid.data.mId).exec();
  if (!note) {
    return res.status(404).send({ success: false, message: "note not found" });
  }

  note.title = isValid.data.title;
  note.desc = isValid.data.desc;
  await note.save();
  const reply: string = `${req.email}, note updated with id ${isValid.data.mId}`;
  res.status(201).send({ success: true, message: reply });
};

// @desc delete note
// @route DELETE api/v1/note/deleteNote
// @access private
const deleteNote = async (
  req: Request & dataToInsert,
  res: Response<UserResponse>,
) => {
  const isValid = isId.safeParse(req.body);
  if (!isValid.success) {
    const msg: string = returnMsg(isValid);
    return res.status(422).send({ success: false, message: msg });
  }
  const note = await NoteSchema.findById(isValid.data.mId).exec();
  if (!note) {
    return res.status(404).send({ success: false, message: "note not found" });
  }
  const data = await note.deleteOne().exec();
  if (!data.acknowledged) {
    return res
      .status(404)
      .send({ success: false, message: "something went wrong/delete note" });
  }

  // now also delete noteId from userSchema notes Array
  await UserSchema.findByIdAndUpdate(
    note.user,
    { $pull: { notes: isValid.data.mId } },
    { new: true },
  )
    .lean()
    .exec();

  const reply: string = `${req.email}, note deleted with id ${isValid.data.mId}`;
  res.status(200).send({ success: true, message: reply });
  // res.status(401).send({success: false, message:'custom'});
};

export { createNote, getAllNotes, updateNote, deleteNote };

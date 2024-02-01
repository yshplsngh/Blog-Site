import {Response, Request} from "express";
import {createNoteForm, createNoteFormWithId, isId} from "../types/noteTypes";
import UserSchema from "../model/user.schema";
import NoteSchema, {noteModel} from "../model/note.schema";
import {returnMsg} from "../utils/ResponseHandler";
import {dataToInsert, UserResponse} from "../types/globalTypes";


// @desc create new note
// @route POST api/v1/note/createNote
// @access private
const createNote = async (req: Request & dataToInsert, res:Response<UserResponse>) => {
    const isValid = createNoteForm.safeParse(req.body);
    if (!isValid.success) {
        const msg: string = returnMsg(isValid);
        return res.status(422).send({success: false, message: msg})
    }
    const found = await UserSchema.findOne({email: req.email}).select(['_id', 'name']).lean().exec()
    if (!found) {
        return res.status(401).send({success: false, message: "user not found"})
    }
    const payload: noteModel = {
        user: found._id,
        title: isValid.data.title,
        desc: isValid.data.desc
    }
    const result = await NoteSchema.create(payload);
    if (result) {
        await UserSchema.findByIdAndUpdate(found._id, {$push: {notes: result._id}}, {new: true}).lean().exec();
        res.status(201).send({success: true, message: `${found.name} your notes created`})
    } else {
        res.status(401).send({success: false, message: "something wrong happen"})
    }
}


// @desc get all notes
// @route GET api/v1/note/getAllNotes
// @access private
const getAllNotes = async (req: Request & dataToInsert,res:Response<UserResponse>) => {
    /*here we need _id to get all notes of that user*/
    const found = await UserSchema.findOne({email: req.email}).select('_id').lean().exec();
    if (!found) {
        return res.status(401).send({success: false, message: "user not found"})
    }
    const notes = await NoteSchema.find({user: found._id}).lean().exec();

    /* no use, but just for shake learn use of Promise.all */
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const userData = await UserSchema.findById(note.user).select('email').lean().exec();
        return {...note, email: userData?.email}
    }))
    res.status(201).send({success:true,message:notesWithUser})
}


// @desc update title,desc
// @route PATCH api/v1/note/updateNote
// @access private
const updateNote = async (req: Request & dataToInsert, res:Response<UserResponse>) => {
    const isValid = createNoteFormWithId.safeParse(req.body);
    if (!isValid.success) {
        const msg: string = returnMsg(isValid);
        return res.status(422).send({success: false, message: msg})
    }
    const note = await NoteSchema.findById(isValid.data.id).exec();
    if (!note) {
        return res.status(404).send({success: false, message: "note not found"})
    }

    note.title = isValid.data.title;
    note.desc = isValid.data.desc;
    await note.save();
    const reply: string = `${req.email}, note updated with id ${isValid.data.id}`
    res.status(201).send({success: true, message: reply});
}


// @desc delete note
// @route DELETE api/v1/note/deleteNote
// @access private
const deleteNote = async (req: Request & dataToInsert, res:Response<UserResponse>) => {
    const isValid = isId.safeParse(req.body);
    if (!isValid.success) {
        const msg: string = returnMsg(isValid);
        return res.status(422).send({success: false, message: msg})
    }
    const note = await NoteSchema.findById(isValid.data.id).exec();
    if (!note) {
        return res.status(404).send({success: false, message: "note not found"})
    }

    await note.deleteOne();
    const reply: string = `${req.email}, note deleted with id ${isValid.data.id}`
    res.status(201).send({success: true, message: reply});
}

export {createNote, getAllNotes, updateNote, deleteNote};
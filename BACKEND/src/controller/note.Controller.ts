import {z} from 'zod'
import {Response,Request} from "express";
import {dataToInsert} from "../types/noteTypes";
import UserSchema from "../model/user.schema";
// import no from "../model/note.schema";
import NoteSchema,{noteModel} from "../model/note.schema";


// @desc create new note
// @route POST api/v1/note/createNote
// @access private

enum noteMsg{
    minLength=" can't be empty",
    maxTLength = "title can't be more than 100 character, pay 2000 for 1 million character upi id: 8439345464@ybl",
    maxDLength = "description can't be more than 1000 character, pay 2000 for 1 million character upi id: 8439345464@ybl"
}

const createNoteForm = z.object({
    title:z.string()
        .trim()
        .min(1,noteMsg.minLength)
        .max(100,noteMsg.maxTLength),
    desc:z.string()
        .trim()
        .min(1,noteMsg.minLength)
        .max(1000,noteMsg.maxDLength)
})

// @desc create new note
// @route POST api/v1/note/createNote
// @access private
const createNote = async (req:Request&dataToInsert,res:Response)=>{
    const isValid = createNoteForm.safeParse(req.body);
    if(!isValid.success){
        const msg:string = isValid.error.issues[0].message;
        return res.status(422).send({success:false,message:msg})
    }
    const found = await UserSchema.findOne({email:req.email}).select(['_id','name']).lean().exec()
    if(!found){
        return res.status(401).send({success:false,message:"user not found"})
    }
    const payload:noteModel = {
        user:found._id,
        title:isValid.data.title,
        desc:isValid.data.desc
    }
    const result = await NoteSchema.create(payload);
    if(result){
        await UserSchema.findByIdAndUpdate(found._id,{$push:{notes:result._id}},{new:true}).lean().exec();
        res.status(201).send({success:true,message:`${found.name} your notes created`})
    }else{
        res.status(401).send({success:false,message:"something wrong happen"})
    }
}


// @desc get all notes
// @route GET api/v1/note/getAllNotes
// @access private
const getAllNotes = async (req:Request&dataToInsert,res:Response)=>{
    const found = await UserSchema.findOne({email:req.email}).select('_id').lean().exec();
    if(!found){
        return res.status(401).send({success:false,message:"user not found"})
    }
    const notes = await NoteSchema.find({user:found._id}).lean().exec();

    /* no use, but just for shake learn use of Promise.all */
    const notesWithUser = await Promise.all(notes.map(async (note)=>{
        const userData = await UserSchema.findById(note.user).select('email').lean().exec();
        return {...note,email:userData?.email}
    }))
    res.status(201).send({notesWithUser})
}


export {createNote,getAllNotes};
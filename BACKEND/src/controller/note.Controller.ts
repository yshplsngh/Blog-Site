import {z} from 'zod'
import {Response,Request} from "express";
import {dataToInsert} from "../types/noteTypes";
import UserSchema from "../model/user.schema";



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
const createNote = async (req:Request&dataToInsert,res:Response)=>{
    const isValid = createNoteForm.safeParse(req.body);
    if(!isValid.success){
        const msg:string = isValid.error.issues[0].message;
        return res.status(422).send({success:false,message:msg})
    }
    const found = await UserSchema.findOne({email:req.email});
    // if(!found){
    //
    // }
    res.status(201).send({isValid,found})
}

export {createNote}
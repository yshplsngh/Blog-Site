import {z, ZodType} from "zod";
import mongoose from "mongoose";

enum noteMsg {
    minLength = " can't be empty",
    maxTLength = "title can't be more than 100 character, pay 2000 for 1 million character upi id: 8439345464@ybl",
    maxDLength = "description can't be more than 1000 character, pay 2000 for 1 million character upi id: 8439345464@ybl"
}



export interface noteInputType {
    title: string,
    desc: string
}

export interface noteInputTypeWithId extends noteInputType {
    id: string
}

const createNoteForm = z.strictObject({
    title: z.string()
        .trim()
        .min(1, noteMsg.minLength)
        .max(100, noteMsg.maxTLength),
    desc: z.string()
        .trim()
        .min(1, noteMsg.minLength)
        .max(1000, noteMsg.maxDLength),
})
const isId = z.strictObject({
    id: z.string()
        .trim()
        .refine((data: string): boolean => {
            return mongoose.Types.ObjectId.isValid(data)
        })
})
const createNoteFormWithId = createNoteForm.merge(isId);

export {createNoteForm, createNoteFormWithId, isId}
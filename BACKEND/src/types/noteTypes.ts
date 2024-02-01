import mongoose from "mongoose";

export interface dataToInsert {
    email?:string
    roles?:string[]
}

export interface noteInputType{
    title:string,
    desc:string
}
export interface noteInputTypeWithId extends noteInputType{
    id:string
}
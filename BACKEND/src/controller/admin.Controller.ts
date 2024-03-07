import UserSchema from "../model/user.schema";
import {Request, Response} from "express";
import {dataToInsert,UserResponse} from "../types/globalTypes";
import {adminLogger} from "../middleware/logger";
import {isId} from "../types/noteTypes";
import {returnMsg} from "../utils/ResponseHandler";
import {updateInfoType} from "../types/adminTypes";
import NoteSchema from "../model/note.schema";
import {isEmail} from "../types/authTypes";


// @desc get all users
// @route GET api/v1/admin/users
// @access private

const getUsers = async (req:Request&dataToInsert,res:Response<UserResponse>) =>{
    const users = await UserSchema
        .find({email:{$ne:req.email}})
        .select('-password')
        .lean()

    if(!users?.length){
        return res.status(400).send({success:false,message:"no users found"});
    }
    adminLogger(req.email,"requested all user")
    return res.status(200).send({success:true,message:users});
}


// @desc get all user notes by email
// @route POST api/v1/admin/users
// @access private
// const getAllNotesByEmail = async (req: Request & dataToInsert,res:Response<UserResponse>) => {
//     // console.log(req.body)
//     const isValid = isEmail.safeParse(req.body);
//     if (!isValid.success){
//         const msg: string = returnMsg(isValid);
//         return res.status(422).send({success: false, message: msg})
//     }
//
//     /*here we need _id to get all notes of that user*/
//     const found = await UserSchema.findOne({email:isValid.data.email}).select('_id').lean().exec();
//     if (!found) {
//         return res.status(401).send({success: false, message: "user not found"})
//     }
//     console.log(found)
//     const notes = await NoteSchema.find({user: found._id}).lean().exec();
//     console.log(notes)
//     /* no use, but just for shake, understand use of Promise.all , so here i am adding email to each note*/
//     const notesWithUser = await Promise.all(notes.map(async (note) => {
//         const userData = await UserSchema.findById(note.user).select('email').lean().exec();
//         return {...note, email: userData?.email}
//     }))
//     res.status(200).send({success:true,message:notesWithUser})
// }


// @desc update user info
// @route PATCH api/v1/admin/users
// @access Private
const updateUserData = async(req:Request&dataToInsert,res:Response<UserResponse>)=>{
    const isValid = updateInfoType.safeParse(req.body);
    if(!isValid.success){
        const msg: string = returnMsg(isValid);
        return res.status(422).send({success: false, message: msg})
    }
    const user = await UserSchema.findById(isValid.data.id).exec();
    if(!user){
        return res.status(400).send({success:false,message:"User not found"})
    }
    user.email = isValid.data.email
    user.name = isValid.data.name
    user.isActive = isValid.data.isActive
    user.roles = isValid.data.roles

    await user.save();
    const reply:string = `Username ${user.name} with ID ${user._id} updated successfully`
    adminLogger(req.email,reply);
    res.status(200).send({success:true,message:reply});
}


// @desc delete a user
// @route DELETE api/v1/admin/users
// @access Private
const deleteUser = async(req:Request&dataToInsert,res:Response<UserResponse>)=>{
    if(!req.roles?.includes('admin')){
        return res.status(401).send({success:false,message:"Unauthorized|Not a Admin"})
    }
    const isValid = isId.safeParse(req.body);
    if (!isValid.success) {
        const msg: string = returnMsg(isValid);
        return res.status(422).send({success: false, message: msg})
    }
    const user = await UserSchema.findById(isValid.data.id).exec();
    if(!user){
        return res.status(400).send({success:false,message:"User not found"})
    }

    await user.deleteOne();
    const reply:string = `Username ${user.name} with ID ${user._id} deleted`
    adminLogger(req.email,reply);
    res.status(200).send({success:true,message:reply});
    // res.status(400).send({success:false,message:'my cutom error'});
}

export {getUsers,deleteUser,updateUserData}
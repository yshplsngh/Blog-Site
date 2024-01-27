import UserSchema from "../model/user.schema";
import {Request, Response} from "express";
import {dataToInsert} from "../types/noteTypes";


// @desc get all users
// @route GET api/v1/admin
// @route private
const getUsers = async (req:Request&dataToInsert,res:Response)=>{
    if(!req.roles?.includes('admin')){
        return res.status(403).send({success:false,message:"Unauthorized|Not a Admin"})
    }
    const users = await UserSchema.find().select('-password').lean();
    if(!users?.length){
        return res.status(400).send({success:false,message:"no users found"});
    }
    res.status(200).send({success:true,users});
}
export {getUsers}
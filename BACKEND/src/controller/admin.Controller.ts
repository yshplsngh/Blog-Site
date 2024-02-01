import UserSchema from "../model/user.schema";
import {Request, Response} from "express";
import {dataToInsert} from "../types/noteTypes";
import {adminLogger} from "../middleware/logger";


// @desc get all users
// @route GET api/v1/admin
// @route private
const getUsers = async (req:Request&dataToInsert,res:Response)=>{
    if(!req.roles?.includes('admin')){
        return res.status(401).send({success:false,message:"Unauthorized|Not a Admin"})
    }
    const users = await UserSchema.find().select('-password').lean();
    if(!users?.length){
        return res.status(400).send({success:false,message:"no users found"});
    }
    adminLogger(req.email,"request all user")
    res.status(200).send({success:true,users});
}


// @desc update user info
// @route PATCH api/v1/admin/users
//



// @desc delete a user
// @route DELETE api/v1/admin
// @access Private
const deleteUser = async(req:Request&dataToInsert,res:Response)=>{
    if(!req.roles?.includes('admin')){
        return res.status(401).send({success:false,message:"Unauthorized|Not a Admin"})
    }

    const {id} = req.body;
    if(!id){
        return res.status(400).send({success:false,message:"User ID required"})
    }

    const user = await UserSchema.findById(id).exec();
    if(!user){
        return res.status(400).send({success:false,message:"User not found"})
    }

    const result = await user.deleteOne();
    const reply = `Username ${user.name} with ID ${user._id} deleted`
    adminLogger(req.email,reply);
    res.status(200).send({success:true,message:reply});
}

export {getUsers,deleteUser}
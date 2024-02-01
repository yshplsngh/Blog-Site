import {Response, Request, NextFunction} from "express";
import {dataToInsert, UserResponse} from "../types/globalTypes";

const verifyAdmin = (req:Request&dataToInsert,res:Response<UserResponse>,next:NextFunction)=>{
    if(!req.roles?.includes('admin')){
        return res.status(401).send({success:false,message:"Unauthorized|Not a Admin"})
    }
    next();
}

export {verifyAdmin}
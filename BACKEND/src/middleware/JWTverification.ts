import jwt from 'jsonwebtoken'
import {NextFunction,Request,Response} from "express";
import {msgLogger} from "./logger";
import {config} from "../config/config";
import {dataToInsert, UserResponse} from "../types/globalTypes";


const JWTverify = (req:Request & dataToInsert,res:Response<UserResponse>,next:NextFunction)=>{
    const headerData = req.headers.authorization || req.headers.Authorization as string
    if(!headerData){
        msgLogger("access token not found in header|jwtVerify");
        return res.status(401).send({success:false,message:"Unauthorised/access token not found in header|jwtVerify"})
    }
    const data:string = headerData.toString()
    if(!data.startsWith('Bearer')){
        msgLogger("access token did not start with Bearer|jwtVerify");
        return res.status(401).send({success:false,message:"Unauthorized/access token did not start with Bearer|jwtVerify"})
    }
    const orgToken:string = data.split(' ')[1]
    // console.log(orgToken);
    jwt.verify(orgToken,config.ACCESS_TOKEN_SECRET,async (err:any,decoded:any)=>{
        if(err){
            msgLogger("expired or modified jwt in header|jwtVerify");
            return res.status(403).send({success:false,message:"UnAuthorized/ expired or modified jwt in header|jwtVerify"});
        }

        req.email = decoded.userInfo.email;
        req.roles = decoded.userInfo.roles;
        next();
    })
}


export {JWTverify}
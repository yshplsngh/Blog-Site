import jwt, {VerifyErrors, JwtPayload, VerifyOptions} from 'jsonwebtoken'
import {NextFunction,Request,Response} from "express";
import {msgLogger} from "./logger";
import {config} from "../config/config";
import {dataToInsert} from "../types/noteTypes";


const JWTverify = (req:Request & dataToInsert,res:Response,next:NextFunction)=>{
    const headerData:string|undefined|string[] = req.headers.authorization || req.headers.Authorization;
    if(!headerData){
        msgLogger("access token not found in header|jwtVerify");
        return res.status(401).send({success:false,message:"Unauthorised"})
    }
    const data:string = headerData.toString()
    if(!data.startsWith('Bearer')){
        msgLogger("access token did not start with Bearer|jwtVerify");
        return res.status(403).send({success:false,message:"Unauthorized"})
    }
    const orgToken:string = data.split(' ')[1]
    jwt.verify(orgToken,config.ACCESS_TOKEN_SECRET,async (err:any,decoded:any)=>{
        if(err){
            msgLogger("invalid jwt in header|jwtVerify");
            return res.status(403).send({success:false,message:"UnAuthorized"});
        }

        req.email = decoded.userInfo.email;
        req.roles = decoded.userInfo.roles;
        next();
    })
}


export {JWTverify}
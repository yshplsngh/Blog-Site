import {Request, Response} from "express";
import  {config} from '../config/config'
import {loginFormData,registerFormData,payloadIn} from "../types/authTypes";
import UserSchema,{userModel} from "../model/user.schema";
import bcrypt from 'bcrypt'
import {authLogger, mainLogger, msgLogger} from "../middleware/logger";
import jwt from 'jsonwebtoken'


// @desc register
// @route POST /api/v1/auth/register
// @access public
const register = async (req:Request,res:Response)=>{
    const isValid = registerFormData.safeParse(req.body)
    if(!isValid.success){
        const msg:string = isValid.error.issues[0].path[0]+" "+isValid.error.issues[0].message;
        return res.status(422).send({success:false,message:msg});
    }

    const found = await UserSchema.findOne({email:isValid.data.email}).lean().exec();
    if(found){
        return res.status(409).send({success:false,message:'User already registered'})
    }

    const hashedPass:string =  await bcrypt.hash(isValid.data.password,10);
    const userData:userModel = {
        name:isValid.data.name,
        email:isValid.data.email,
        password:hashedPass,
        roles:['people'],
        isActive:true,
        notes:[]
    }

    const user = await UserSchema.create(userData);
    if(user){
        const msg:string = user.name+" your account created successfully"
        authLogger(user.name,user.email,"new account");
        res.status(201).send({success:true,message:msg});
    }else{
        res.status(201).send({success:false,message:"something went wrong"});
    }
}


// @desc login
// @route GET /api/v1/auth/login
// @access Public
const login = async (req:Request,res:Response)=>{
    const isValid = loginFormData.safeParse(req.body);
    if(!isValid.success){
        const mess:string = isValid.error.issues[0].path[0]+" "+isValid.error.issues[0].message;
        return res.status(422).json({message:mess})
    }

    const found = await UserSchema.findOne({email:isValid.data.email}).lean().exec();
    if(!found){
        return res.status(401).send({success:false,message:"invalid credential"})
    }

    const match:boolean = await bcrypt.compare(isValid.data.password,found.password);
    if(!match){
        return res.status(401).send({success:false,message:"invalid credential"})
    }

    const userInfo:payloadIn = {name:found.name,email:found.email,roles:found.roles};

    const accessToken:string = jwt.sign(
        {userInfo}, config.ACCESS_TOKEN_SECRET,
        {expiresIn: '2d'});

    const refreshToken:string = jwt.sign(
        {"email":found.email},config.REFRESH_TOKEN_SECRET,
        {expiresIn:'7d'}
    )

    res.cookie('jwt',refreshToken, {
        maxAge: 7*24*60*60*1000, httpOnly: true,
        sameSite:"none",secure:true
    });
    authLogger(found.name,found.email,"login");
    res.status(200).send({success:true,accessToken});
}


// @desc refresh token,coz token is expired
// @route Get /api/v1/auth/refresh
// @access public
const refresh = async (req:Request,res:Response)=>{
    const cookie = req.cookies;
    if(!cookie?.jwt){
        msgLogger("jwt not found in cookies|refresh")
        return res.status(401).send({success:false,message:"UnAuthorised"})
    }
    jwt.verify(cookie.jwt,config.REFRESH_TOKEN_SECRET,async (err:any,decoded:any)=>{
        if(err){
            msgLogger("invalid jwt in cookies|refresh");
            return res.status(401).send({success:false,message:"UnAuthorized"});
        }

        const found = await UserSchema
            .findOne({email:decoded.email})
            .select(['-_id','-password','-isActive','-createdAt','-updatedAt']).lean().exec();

        if(!found){
            msgLogger("user found in jwt is not found|refresh");
            return res.status(401).send({success:false,message:"UnAuthorized"})
        }

        const  userInfo:payloadIn  = {
            name:found.name,
            email:found.email,
            roles:found.roles
        }

        const accessToken:string = jwt.sign({userInfo},config.ACCESS_TOKEN_SECRET,{expiresIn:'15m'})
        res.status(200).send({success:true,accessToken});
    });
}

export {login,register,refresh};



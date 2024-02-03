import {Request, Response} from "express";
import  {config} from '../config/config'
import {loginFormData, registerFormData, payloadIn} from "../types/authTypes";
import UserSchema,{userModel} from "../model/user.schema";
import bcrypt from 'bcrypt'
import {authLogger, msgLogger} from "../middleware/logger";
import jwt from 'jsonwebtoken'
import {returnMsg} from "../utils/ResponseHandler";
import {UserResponse} from "../types/globalTypes";



// @desc register
// @route POST /api/v1/auth/register
// @access public
const register = async (req:Request,res:Response<UserResponse>)=>{
    const isValid = registerFormData.safeParse(req.body)
    if(!isValid.success){
        const msg:string = returnMsg(isValid);
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
        notes:[],
        refreshToken:[]
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
// @route POST /api/v1/auth/login
// @access Public
const login = async (req:Request,res:Response<UserResponse>)=>{
    const cookies = req.cookies;
    console.log(`cookie available at login:`,cookies);

    const isValid = loginFormData.safeParse(req.body);
    if(!isValid.success){
        const mess:string = returnMsg(isValid);
        return res.status(422).json({success:false,message:mess})
    }

    const found = await UserSchema.findOne({email:isValid.data.email}).exec();
    if(!found){
        return res.status(401).send({success:false,message:"invalid credential"})
    }
    if(!found.isActive){
        return res.status(403).send({success:false,message:"you are blocked motherfucker"})
    }

    const match:boolean = await bcrypt.compare(isValid.data.password,found.password);
    if(!match){
        return res.status(401).send({success:false,message:"invalid credential"})
    }

    const userInfo:payloadIn = {name:found.name,email:found.email,roles:found.roles};

    const accessToken:string = jwt.sign(
        {userInfo}, config.ACCESS_TOKEN_SECRET,
        {expiresIn: '15m'});

    const newRefreshToken:string = jwt.sign(
        {"email":found.email},config.REFRESH_TOKEN_SECRET,
        {expiresIn:'1d'}
    )
    /*store all refresh token except current user one*/
    let newRefreshTokenArray:String[] = !cookies?.jwt ?
        found.refreshToken : found.refreshToken.filter(rt=>rt!==cookies.jwt)

    if(cookies?.jwt){
        /*here I don't understand why we are doing this*/
        const refreshToken = cookies.jwt
        const foundToken = await UserSchema.findOne({refreshToken}).exec();
        if(!foundToken){
            console.log('attempted refresh token reuse at login!')
            newRefreshTokenArray=[];
        }
        /*clear previous token while log in*/
        res.clearCookie('jwt',{httpOnly:true,sameSite:'none',secure:true})
    }


    found.refreshToken = [...newRefreshTokenArray,newRefreshToken];

    await found.save();

    res.cookie('jwt',newRefreshToken, {
        maxAge: 7*24*60*60*1000, httpOnly: true,
        sameSite:"none",secure:true
    });

    authLogger(found.name,found.email,"login");
    res.status(200).send({success:true,message:accessToken});
}


// @desc refresh token,coz token is expired
// @route GET /api/v1/auth/refresh
// @access public
const refresh = async (req:Request,res:Response<UserResponse>)=>{
    const cookie = req.cookies;
    if(!cookie?.jwt){
        msgLogger("jwt not found in cookies|refresh")
        return res.status(401).send({success:false,message:"UnAuthorised"})
    }
    /* while refreshing clear this RT so after we can store new one */
    const refreshToken = cookie.jwt;
    res.clearCookie('jwt',{httpOnly:true,sameSite:'none',secure:true})

    const foundUser = await UserSchema.findOne({refreshToken}).exec();

    /*if NO RT found mean user is reusing it COZ at every refresh request jwt removed from cookies
    * and also from database and this token is already removed.
    * also don't understand this one*/
    if(!foundUser){
        jwt.verify(refreshToken,config.REFRESH_TOKEN_SECRET,async (err:any,decoded:any)=>{
            if(err){
                msgLogger("RT found in cookies but not found in DB and also invalid|refresh");
                return res.status(401).send({success:false,message:"UnAuthorized"});
            }
            const hackedUser = await UserSchema.findOne({email:decoded.email}).exec();
            if(hackedUser!==null){
                hackedUser.refreshToken = [];
                await hackedUser.save();
            }
        })
        return res.status(403).send({success:false,message:"UnAuthorized/ expired or modified jwt in header|jwtVerify"});
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt=>rt!=refreshToken);

    jwt.verify(refreshToken,config.REFRESH_TOKEN_SECRET,async (err:any,decoded:any)=>{
        if(err){
            foundUser.refreshToken = [...newRefreshTokenArray]
            await foundUser.save();
        }
        if(err || foundUser.email!==decoded.email){
            msgLogger("invalid jwt in cookies|refresh");
            return res.status(401).send({success:false,message:"UnAuthorized"});
        }
        /*untill here RT is still valid*/

        const  userInfo:payloadIn  = {
            name:foundUser.name,
            email:foundUser.email,
            roles:foundUser.roles
        }
        const roles:string[] = foundUser.roles;
        const accessToken:string = jwt.sign({userInfo},config.ACCESS_TOKEN_SECRET,{expiresIn:'15m'})

        const newRefreshToken:string = jwt.sign({"email":foundUser.email},config.REFRESH_TOKEN_SECRET, {expiresIn:'1d'})

        foundUser.refreshToken = [...newRefreshTokenArray,newRefreshToken];
        res.cookie('jwt',newRefreshToken,{httpOnly:true,secure:true,sameSite:"none"})

        res.status(200).send({success:true,message:{accessToken,roles}});
    });
}

export {login,register,refresh};



import { Request, Response } from "express";
import { config } from "../config/config";
import { loginFormData, signupFormData, payloadIn } from "../types/authTypes";
import UserSchema, { userModel } from "../model/user.schema";
import bcrypt from "bcrypt";
import { authLogger, msgLogger } from "../middleware/logger";
import jwt from "jsonwebtoken";
import { returnMsg } from "../utils/ResponseHandler";
import { UserResponse } from "../types/globalTypes";

// @desc signup
// @route POST /api/v1/auth/signup
// @access public
const signup = async (req: Request, res: Response<UserResponse>) => {
  const isValid = signupFormData.safeParse(req.body);
  if (!isValid.success) {
    const msg: string = returnMsg(isValid);
    return res.status(422).send({ success: false, message: msg });
  }

  const found = await UserSchema.findOne({ email: isValid.data.email })
    .lean()
    .exec();
  if (found) {
    return res
      .status(409)
      .send({ success: false, message: "User already registered" });
  }

  const hashedPass: string = await bcrypt.hash(isValid.data.password, 10);
  const userData: userModel = {
    name: isValid.data.name,
    email: isValid.data.email,
    password: hashedPass,
    roles: ["people"],
    isActive: true,
    notes: [],
    refreshToken: [],
  };

  const user = await UserSchema.create(userData);
  if (user) {
    const msg: string = user.name + " your account created successfully";
    authLogger(user.name, user.email, "new account");
    res.status(201).send({ success: true, message: msg });
  } else {
    res.status(201).send({ success: false, message: "something went wrong" });
  }
};

// @desc login
// @route POST /api/v1/auth/login
// @access Public
const login = async (req: Request, res: Response<UserResponse>) => {
  const cookies = req.cookies;
  // console.log(`cookie available at login:`,cookies);

  const isValid = loginFormData.safeParse(req.body);
  if (!isValid.success) {
    const mess: string = returnMsg(isValid);
    return res.status(422).json({ success: false, message: mess });
  }

  const found = await UserSchema.findOne({ email: isValid.data.email }).exec();
  if (!found) {
    return res
      .status(401)
      .send({ success: false, message: "invalid credential" });
  }
  if (!found.isActive) {
    return res
      .status(404)
      .send({ success: false, message: "you are blocked motherfucker" });
  }

  const match: boolean = await bcrypt.compare(
    isValid.data.password,
    found.password,
  );
  if (!match) {
    return res
      .status(401)
      .send({ success: false, message: "invalid credential" });
  }

  const userInfo: payloadIn = {
    name: found.name,
    email: found.email,
    roles: found.roles,
  };

  /* here is schenerio when user log in and if RT token is present in cookies then-
   * that RT will we deleted from DB and new one will be inserted in that array
   * and that RT will be replaced with new one.
   * BUT-> if user clear their cookies then no RT will found in cookies and then DB RT array
   * will be same. and we issue a new RT and add new RT to DB and cookies
   * so DB RT array will continue to increase if user clear their cookies before login*/
  const accessToken: string = jwt.sign(
    { userInfo },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const newRefreshToken: string = jwt.sign(
    { email: found.email },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" },
  );
  /*store all refresh token except current user one*/
  let newRefreshTokenArray: string[] = !cookies?.jwt
    ? found.refreshToken
    : found.refreshToken.filter((rt) => rt !== cookies.jwt);

  /*to underStand refer refresh endpoint*/
  if (cookies?.jwt) {
    const refreshToken = cookies.jwt;
    const foundToken = await UserSchema.findOne({ refreshToken }).exec();
    if (!foundToken) {
      console.log("attempted refresh token reuse at login!");
      newRefreshTokenArray = [];
    }
    /*clear previous token while log in*/
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  }

  found.refreshToken = [...newRefreshTokenArray, newRefreshToken];

  const result = await found.save();
  // console.log(result)

  res.cookie("jwt", newRefreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  authLogger(found.name, found.email, "login");
  // res.status(200).send({success:true,message:accessToken});
  res.status(200).send({ success: true, message: { accessToken } });
};

// @desc refresh token,coz token is expired
// @route GET /api/v1/auth/refresh
// @access public
const refresh = async (req: Request, res: Response<UserResponse>) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) {
    msgLogger("jwt not found in cookies|refresh");
    return res.status(401).send({
      success: false,
      message: "UnAuthorised/ RT not found in cookies DR refreshing",
    });
  }
  /* while refreshing clear this RT ,so after we can store new one */
  const refreshToken = cookie.jwt;
  // console.log(refresh+"=="+refreshToken)
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  const foundUser = await UserSchema.findOne({ refreshToken }).exec();
  // console.log(foundUser);

  /*so we are using this for a specific schenerio where hacker somehow get your refresh token and try
   * to send it with cookies. but we know when access token expire user request come here and check current
   * RT. suppose Z which is  present in DB which is obious. then server issued a new RT and AT to user and remove
   * received token from cookies and DB.so hacker have your RT ,and it is valid,but it is removed from DB so
   * we remove all RT from DB. but here is case when you request a new AT and RT and close app. and this token
   * is also present in DB. and also valid obiously. with 1day expiry*/

  if (!foundUser) {
    jwt.verify(
      refreshToken,
      config.REFRESH_TOKEN_SECRET,
      async (err: any, decoded: any) => {
        if (err) {
          msgLogger(
            "RT found in cookies but not found in DB and also invalid|refresh",
          );
          return res
            .status(401)
            .send({ success: false, message: "UnAuthorized" });
        }
        const hackedUser = await UserSchema.findOne({
          email: decoded.email,
        }).exec();
        // console.log(hackedUser);
        if (hackedUser !== null) {
          hackedUser.refreshToken = [];
          await hackedUser.save();
        }
      },
    );
    return res.status(401).send({
      success: false,
      message: "UnAuthorized/RT not found in DB|refresh",
    });
  }

  const newRefreshTokenArray: string[] = foundUser.refreshToken.filter(
    (rt) => rt != refreshToken,
  );

  jwt.verify(
    refreshToken,
    config.REFRESH_TOKEN_SECRET,
    async (err: any, decoded: any) => {
      if (err) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        await foundUser.save();
      }
      if (err || foundUser.email !== decoded.email) {
        msgLogger("invalid jwt in cookies|refresh");
        return res
          .status(403)
          .send({ success: false, message: "UnAuthorized/login expired" });
      }
      /*until here RT is still valid*/

      const userInfo: payloadIn = {
        name: foundUser.name,
        email: foundUser.email,
        roles: foundUser.roles,
      };
      const roles: string[] = foundUser.roles;
      const accessToken: string = jwt.sign(
        { userInfo },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );

      const newRefreshToken: string = jwt.sign(
        { email: foundUser.email },
        config.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" },
      );

      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await foundUser.save();
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res
        .status(200)
        .send({ success: true, message: { accessToken: accessToken, roles } });
    },
  );
};

// @desc logout
// @route POST api/v1/auth/logOut
// @access Public
const logOut = async (req: Request, res: Response<UserResponse>) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
    // return res.status(204).send({success:false,message:"jwt not found in cookies"})
  }
  const refreshToken = cookies.jwt;
  const foundUser = await UserSchema.findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204);
    // return res.status(204).send({success:true,message:"jwt removed from cookies and but not found in DB"})
  }
  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken,
  );
  foundUser.refreshToken = [...newRefreshTokenArray];
  await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  return res.sendStatus(204);
};
export { login, signup, refresh, logOut };

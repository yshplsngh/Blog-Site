import express, { Router} from "express";
const router:Router = express.Router();
import {logOut, login, refresh, signup} from "../controller/auth.Controller"
import { JWTverify } from "../middleware/JWTverification"


router.route('/login').post(login)
router.route('/signup').post(signup)
router.route('/refresh').get(refresh)
router.route('/logOut').get(logOut)

export {router as authRouter}
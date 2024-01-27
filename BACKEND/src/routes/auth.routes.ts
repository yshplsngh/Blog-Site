import express, { Router} from "express";
const router:Router = express.Router();
import {login, refresh, register} from "../controller/auth.Controller"

router.route('/login').get(login)

router.route('/register').post(register)

router.route('/refresh').get(refresh)

export {router as authRouter}
import express, {Router} from "express";
const router:Router = express.Router();
import {getUsers} from '../controller/admin.Controller';
import {JWTverify} from "../middleware/JWTverification";

router.route('/').get(JWTverify,getUsers);

export {router as adminRouter}
import express, {Router} from "express";
const router:Router = express.Router();
import {getUsers,deleteUser} from '../controller/admin.Controller';
import {JWTverify} from "../middleware/JWTverification";

router.route('/')
    .get(JWTverify,getUsers)
    .delete(JWTverify,deleteUser)

export {router as adminRouter}
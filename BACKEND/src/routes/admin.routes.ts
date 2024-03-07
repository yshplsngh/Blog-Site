import express, {Router} from "express";
const router:Router = express.Router();
import {getUsers, deleteUser, updateUserData} from '../controller/admin.Controller';
import {JWTverify} from "../middleware/JWTverification";
import {verifyAdmin} from "../middleware/verifyAdmin";

router.route('/users')
    .get(JWTverify,verifyAdmin,getUsers)
    .patch(JWTverify,verifyAdmin,updateUserData)
    .delete(JWTverify,verifyAdmin,deleteUser)

export {router as adminRouter}
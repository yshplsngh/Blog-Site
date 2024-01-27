import express, {Router} from 'express'
const router:Router = express.Router()
import {createNote} from "../controller/note.Controller";
import {JWTverify} from "../middleware/JWTverification";


router.route('/createNote').post(JWTverify,createNote);

export {router as noteRouter}
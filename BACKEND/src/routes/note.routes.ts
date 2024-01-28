import express, {Router} from 'express'
const router:Router = express.Router()
import {createNote, getAllNotes} from "../controller/note.Controller";
import {JWTverify} from "../middleware/JWTverification";


router.route('/createNote').post(JWTverify,createNote);
router.route('/getAllNotes').get(JWTverify,getAllNotes);

export {router as noteRouter}
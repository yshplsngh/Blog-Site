import express, { Router } from "express";
import { JWTverify } from "../middleware/JWTverification";
import { updateProfile, changePassword } from "../controller/user.Controller";
const router: Router = express.Router();

router.route("/updateProfile").patch(JWTverify, updateProfile);
router.route("/changePassword").patch(JWTverify, changePassword);

export { router as userRouter };

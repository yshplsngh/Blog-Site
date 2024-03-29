import express, { Router } from "express";
const router: Router = express.Router();
import { logOut, login, refresh, signup } from "../controller/auth.Controller";

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/refresh").get(refresh);
router.route("/logOut").post(logOut);

export { router as authRouter };

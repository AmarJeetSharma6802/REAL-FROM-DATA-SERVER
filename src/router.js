import Router from "express";
import { registerUser, login, loggedOut } from "./controllers/user.controller.js";
import { verifyJwt } from "./middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").post(verifyJwt, loggedOut); // Protect logout route

export default router;

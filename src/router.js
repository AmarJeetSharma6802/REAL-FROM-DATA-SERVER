import Router from "express";
import { registerUser, login, loggedOut,changePassword, getData, updateAccountDetails } from "./controllers/user.controller.js";
import { verifyJwt } from "./middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").post(verifyJwt, loggedOut);  // Protect logout route
router.route("/ch-password").post(verifyJwt, changePassword);  
router.route("/get-data").get(verifyJwt, getData);  
router.route("/update").post(verifyJwt, updateAccountDetails);  

export default router;
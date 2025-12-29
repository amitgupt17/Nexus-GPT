import {Signup, Login,Logout} from "../controllers/AuthController.js";
import express from "express";
const router = express.Router();


router.post("/signup", Signup);
router.post('/login', Login);
router.post('/logout',Logout);
export default router;

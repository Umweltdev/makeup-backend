import express from "express";
import { 
    login, 
    register, 
    me,
    // subscribe 
} from "../controllers/auth.js";
import {  verifyToken } from "../utils/verifyToken.js";
import {Multer, uploadImages} from '../middlewares/uploadFile.js'

const router = express.Router();

router.post("/register", Multer.single('img'), uploadImages, register)
router.post("/login", login)
router.get("/me", verifyToken, me)
//router.post("/subscribe", subscribe);   

export default router
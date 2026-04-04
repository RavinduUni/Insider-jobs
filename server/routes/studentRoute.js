import { Router } from "express";
import { loginStudent, registerStudent } from "../controllers/studentController.js";
import upload from "../configs/multer.js";

const studentRouter = Router();

studentRouter.post('/register', upload.single('resume'), registerStudent);
studentRouter.post('/login', loginStudent);

export default studentRouter;
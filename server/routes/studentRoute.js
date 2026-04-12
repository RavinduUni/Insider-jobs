import { Router } from "express";
import { enhanceResumeText, getStudent, loginStudent, registerStudent, sendEmailVerificationOtp, updateStudent } from "../controllers/studentController.js";
import upload from "../configs/multer.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const studentRouter = Router();

studentRouter.post('/send-otp', sendEmailVerificationOtp);
studentRouter.post('/register', upload.single('resume'), registerStudent);
studentRouter.post('/login', loginStudent);
studentRouter.get('/profile', verifyToken, getStudent);
studentRouter.put('/update-profile', verifyToken, upload.single('profilePicture'), updateStudent);
studentRouter.post('/enhance', enhanceResumeText);

export default studentRouter;
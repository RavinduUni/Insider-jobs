import { Router } from "express";
import { applyProject, enhanceResumeText, getStudent, loginStudent, registerStudent, sendEmailVerificationOtp, updateStudent } from "../controllers/studentController.js";
import upload from "../configs/multer.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const studentRouter = Router();

studentRouter.post('/send-otp', sendEmailVerificationOtp);
studentRouter.post('/register', upload.single('resume'), registerStudent);
studentRouter.post('/login', loginStudent);
studentRouter.get('/profile', verifyToken, getStudent);
studentRouter.put('/update-profile', verifyToken, upload.fields([
	{ name: 'profilePicture', maxCount: 1 },
	{ name: 'resume', maxCount: 1 },
]), updateStudent);
studentRouter.post('/enhance', enhanceResumeText);
studentRouter.post('/apply-project', verifyToken, upload.fields([
	{ name: 'cvFile', maxCount: 1 },
	{ name: 'planFile', maxCount: 1 }
]), applyProject);

export default studentRouter;
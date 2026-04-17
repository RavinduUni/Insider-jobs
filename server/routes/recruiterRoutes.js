import { Router } from "express";
import { createProject, getAllApplicationsForProject, getRecruiter, loginRecruiter, registerRecruiter, sendEmailVerificationOtp, updateRecruiter } from "../controllers/recruiterController.js";
import upload from "../configs/multer.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const recruiterRouter = Router();

recruiterRouter.post('/send-otp', sendEmailVerificationOtp);
recruiterRouter.post('/register', upload.single('companyLogo'), registerRecruiter);
recruiterRouter.post('/login', loginRecruiter);
recruiterRouter.post('/create-project', verifyToken, createProject);
recruiterRouter.get('/profile',verifyToken, getRecruiter);
recruiterRouter.put('/update-profile', verifyToken, upload.single('companyLogo'), updateRecruiter);
recruiterRouter.get('/project-applicants', verifyToken, getAllApplicationsForProject);

export default recruiterRouter;
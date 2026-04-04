import { Router } from "express";
import { loginRecruiter, registerRecruiter } from "../controllers/recruiterController.js";
import upload from "../configs/multer.js";

const recruiterRouter = Router();

recruiterRouter.post('/register', upload.single('companyLogo'), registerRecruiter);
recruiterRouter.post('/login', loginRecruiter);

export default recruiterRouter;
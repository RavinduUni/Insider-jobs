import { Router } from "express";
import { getAllProjects, getProjectsByRecruiterId } from "../controllers/projectsController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const projectRouter = Router();

projectRouter.get('/', getAllProjects);
projectRouter.get('/:recruiterId',verifyToken, getProjectsByRecruiterId);

export default projectRouter;
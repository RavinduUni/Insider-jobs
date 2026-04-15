import { Router } from "express";
import { getAllProjects } from "../controllers/projectsController.js";

const projectRouter = Router();

projectRouter.get('/', getAllProjects);

export default projectRouter;
import { Router } from "express";
import { addProject, deleteProject, getAllProjects, getProjects, updateProject, updateProjectStatus } from "../controllers/ProjectController.js";

const projectRouter = Router()

projectRouter.post("/add",addProject)
projectRouter.get("/all",getAllProjects)
projectRouter.put("/update/:projectId",updateProject)
projectRouter.delete("/delete/:projectId",deleteProject)
projectRouter.get("/myprojects",getProjects)
projectRouter.patch('/:projectId/status', updateProjectStatus)




export default projectRouter
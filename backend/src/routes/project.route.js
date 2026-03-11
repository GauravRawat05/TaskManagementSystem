import { Router } from "express";
import { createProject, getAllProject, updateDeadline } from "../controllers/project.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

router.route("/add/project").post(createProject)

router.route("/update/deadline/:projectId").post(updateDeadline)

router.route("/get/project").get(getAllProject)


export default router;

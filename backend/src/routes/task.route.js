import { Router } from "express";
import { createNewTask, getAllTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Team Leader assigns a task
router.route("/new-task").post(createNewTask);

// Get tasks (scoped by workspace role via x-workspace-id header)
router.route("/get/tasks").get(getAllTask);

// Update task (member: status only; leader/admin: full)
router.route("/update/:taskId").patch(updateTask);

// Delete task
router.route("/delete/:taskId").delete(deleteTask);

export default router;


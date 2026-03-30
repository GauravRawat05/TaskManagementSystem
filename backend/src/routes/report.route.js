import { Router } from "express";
import { submitReport, getMyReports, getTeamReports } from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Team Member submits or updates daily report
router.route("/submit").post(submitReport);

// Team Member views their own report history
router.route("/my-reports").get(getMyReports);

// Team Leader / Admin / Manager views all reports for a team
router.route("/team/:teamId").get(getTeamReports);

export default router;

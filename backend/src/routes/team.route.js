
import { Router } from "express";

import { addNewMember, createTeam, getTeams, removeTeamLeaderAndAddToTeam, removeTeamMember, setNewTeamLeader } from "../controllers/team.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

router.route("/add/team").post(createTeam)

router.route("/fetch/team").get(getTeams)

router.route("/add-memeber/team/:teamId").patch(addNewMember)

router.route("/set/new/team-leader/:teamId").patch(setNewTeamLeader)

router.route("/remove-intern/team/:teamId").patch(removeTeamMember)

router.route("/remove-lead/add-team/:teamId").patch(removeTeamLeaderAndAddToTeam)



export default router;

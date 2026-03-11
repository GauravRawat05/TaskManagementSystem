import { Router } from "express";
import { registerUser, userFetch, userLoggedIn, userLoggedOut } from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";


const router = Router()


router.route("/user/register").post(registerUser)

router.route("/user/login" ).post(userLoggedIn)

router.route("/user/logout").post(verifyJWT, userLoggedOut)

router.route("/user/fetch").post(verifyJWT, userFetch)



export default router;

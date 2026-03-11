import { Router } from "express";
import { uploadFile } from "../middlewares/multer.middleware.js";
import { addBulkIntern, availableIntern, getAllInterns, internLogin, internLogout } from "../controllers/intern.controller.js";
import verifyJWTIntern from "../middlewares/intern.middleware.js";
import verifyJWT from '../middlewares/auth.middleware.js';


const router = Router()


router.route("/add/interns/bulk").post(
    uploadFile.fields([
      {
          name : "bulkIntern",
          maxCount : 1
      }
    ]),
    addBulkIntern
)


router.route("/get/all/interns").get(getAllInterns)

router.route("/available/interns").get(availableIntern)

router.route("/login/intern").post(internLogin)

router.route("/logout/intern").post(verifyJWTIntern, internLogout)




export default router;

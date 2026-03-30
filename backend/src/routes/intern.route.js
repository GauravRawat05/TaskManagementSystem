import { Router } from "express";
import { uploadFile } from "../middlewares/multer.middleware.js";
import { addBulkIntern, addSingleIntern, availableIntern, getAllInterns } from "../controllers/intern.controller.js";
import { verifyJWT, verifyWorkspaceAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

// Bulk upload — Admin/Manager only
router.route("/add/interns/bulk").post(
  verifyWorkspaceAdmin,
  uploadFile.fields([{ name: "bulkIntern", maxCount: 1 }]),
  addBulkIntern
);

// Single add — Admin/Manager only
router.route("/add/single").post(verifyWorkspaceAdmin, addSingleIntern);

// Get all users in global pool
router.route("/get/all/interns").get(getAllInterns);

// Get available members in a workspace not yet in any team
router.route("/available/:workspaceId").get(availableIntern);

export default router;


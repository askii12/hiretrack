import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats,
} from "../controllers/applicationController.js";

const router = express.Router();

router.use(protect);

router.get("/stats", getApplicationStats);

router.route("/").post(createApplication).get(getApplications);
router
  .route("/:id")
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

export default router;

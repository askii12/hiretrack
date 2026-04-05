import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getActivityLogs } from "../controllers/activityController.js";

const router = express.Router();

router.use(protect);

router.get("/", getActivityLogs);

export default router;

import express from "express";
import {
  getMyAnalytics,
  getAdminAnalytics,
  recalculateAnalytics,
} from "./analyticsController.js";

import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, roleMiddleware("customer"), getMyAnalytics);

router.get("/admin",
  authMiddleware,
  roleMiddleware("admin"),
  getAdminAnalytics
);

router.get(
  "/recalculate",
  authMiddleware,
  roleMiddleware("customer", "admin"),
  recalculateAnalytics
);

export default router;
import { Router } from "express";
import { authenticateKeycloak } from "../middleware/authenticateKeycloak.js";
import { requireRole } from "../middleware/requireRole.js";
import type { AuthenticatedRequest } from "../types.js";

export const protectedRouter = Router();

protectedRouter.get("/public", (_req, res) => {
  res.json({
    message: "This endpoint is public. No Keycloak token is required.",
    timestamp: new Date().toISOString(),
  });
});

protectedRouter.get("/me", authenticateKeycloak, (req: AuthenticatedRequest, res) => {
  res.json({
    message: "You accessed a protected endpoint with a valid Keycloak access token.",
    user: req.user,
  });
});

protectedRouter.get(
  "/admin/reports",
  authenticateKeycloak,
  requireRole("admin"),
  (req: AuthenticatedRequest, res) => {
    res.json({
      message: "You accessed an admin-only endpoint.",
      requestedBy: req.user,
      report: {
        activeUsers: 128,
        openRiskEvents: 3,
        generatedAt: new Date().toISOString(),
      },
    });
  },
);

import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../types.js";

export function requireRole(requiredRole: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication is required." });
      return;
    }

    if (!req.user.roles.includes(requiredRole)) {
      res.status(403).json({
        message: `Forbidden. Required Keycloak role: ${requiredRole}.`,
        userRoles: req.user.roles,
      });
      return;
    }

    next();
  };
}

export function requireAnyRole(requiredRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication is required." });
      return;
    }

    const hasRequiredRole = requiredRoles.some((role) => req.user?.roles.includes(role));

    if (!hasRequiredRole) {
      res.status(403).json({
        message: `Forbidden. Required one of Keycloak roles: ${requiredRoles.join(", ")}.`,
        userRoles: req.user.roles,
      });
      return;
    }

    next();
  };
}

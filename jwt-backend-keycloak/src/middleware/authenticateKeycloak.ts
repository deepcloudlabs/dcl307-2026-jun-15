import type { NextFunction, Response } from "express";
import { verifyKeycloakAccessToken } from "../auth/keycloak.service.js";
import type { AuthenticatedRequest } from "../types.js";

function extractBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

export async function authenticateKeycloak(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({
      message: "Missing Authorization header. Expected: Bearer <keycloakAccessToken>",
    });
    return;
  }

  try {
    req.accessToken = token;
    req.user = await verifyKeycloakAccessToken(token);
    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired Keycloak access token.",
    });
  }
}

import { Router } from "express";
import { buildAuthorizationUrl } from "../auth/keycloak.service.js";
import { config } from "../config.js";

export const authRouter = Router();

authRouter.get("/metadata", (_req, res) => {
  res.json({
    provider: "keycloak",
    realm: config.keycloak.realm,
    clientId: config.keycloak.clientId,
    issuer: config.keycloak.issuer,
    authorizationEndpoint: `${config.keycloak.issuer}/protocol/openid-connect/auth`,
    tokenEndpoint: `${config.keycloak.issuer}/protocol/openid-connect/token`,
    jwksUri: config.keycloak.jwksUri,
    logoutEndpoint: `${config.keycloak.issuer}/protocol/openid-connect/logout`,
  });
});

authRouter.get("/login-url", (req, res) => {
  const redirectUri =
    typeof req.query.redirectUri === "string" && req.query.redirectUri.length > 0
      ? req.query.redirectUri
      : config.corsOrigin;

  const state = typeof req.query.state === "string" ? req.query.state : undefined;
  const scope = typeof req.query.scope === "string" ? req.query.scope : undefined;

  res.json({
    authorizationUrl: buildAuthorizationUrl({ redirectUri, state, scope }),
  });
});

authRouter.post("/login", (_req, res) => {
  res.status(410).json({
    message:
      "Local username/password login has been disabled. Authenticate with Keycloak and send the Keycloak access token as Authorization: Bearer <token>.",
  });
});

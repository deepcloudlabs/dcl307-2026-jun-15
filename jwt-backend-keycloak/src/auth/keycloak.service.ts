import { createRemoteJWKSet, errors, jwtVerify } from "jose";
import { config } from "../config.js";
import type { AuthenticatedUser, KeycloakTokenPayload } from "../types.js";

const jwks = createRemoteJWKSet(new URL(config.keycloak.jwksUri));

function normalizeRoles(roles: unknown): string[] {
  if (!Array.isArray(roles)) {
    return [];
  }

  return roles.filter((role): role is string => typeof role === "string");
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function getClientRoles(payload: KeycloakTokenPayload): string[] {
  const roles = payload.resource_access?.[config.keycloak.clientId]?.roles;
  return normalizeRoles(roles);
}

function getRealmRoles(payload: KeycloakTokenPayload): string[] {
  return normalizeRoles(payload.realm_access?.roles);
}

function toAuthenticatedUser(payload: KeycloakTokenPayload): AuthenticatedUser {
  const realmRoles = getRealmRoles(payload);
  const clientRoles = getClientRoles(payload);
  const roles = unique([...realmRoles, ...clientRoles]);

  return {
    id: payload.sub,
    sub: payload.sub,
    username: payload.preferred_username,
    email: payload.email,
    name: payload.name,
    realmRoles,
    clientRoles,
    roles,
    token: payload,
  };
}

export async function verifyKeycloakAccessToken(
  token: string,
): Promise<AuthenticatedUser> {
  try {
    const { payload } = await jwtVerify<KeycloakTokenPayload>(token, jwks, {
      issuer: config.keycloak.issuer,
      audience: config.keycloak.audience,
      algorithms: config.keycloak.allowedAlgorithms,
      clockTolerance: config.keycloak.clockToleranceSeconds,
    });

    if (!payload.sub) {
      throw new Error("Token does not contain a subject claim.");
    }

    return toAuthenticatedUser(payload);
  } catch (error) {
    if (error instanceof errors.JOSEError) {
      throw new Error(`Keycloak token validation failed: ${error.code}`);
    }

    throw error;
  }
}

export function buildAuthorizationUrl(options: {
  redirectUri: string;
  state?: string;
  scope?: string;
}): string {
  const url = new URL(`${config.keycloak.issuer}/protocol/openid-connect/auth`);

  url.searchParams.set("client_id", config.keycloak.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", options.redirectUri);
  url.searchParams.set("scope", options.scope ?? "openid profile email");

  if (options.state) {
    url.searchParams.set("state", options.state);
  }

  return url.toString();
}

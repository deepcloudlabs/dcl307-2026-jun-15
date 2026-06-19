import type { Request } from "express";
import type { JWTPayload } from "jose";

export type KeycloakResourceAccess = Record<
  string,
  {
    roles?: string[];
  }
>;

export type KeycloakTokenPayload = JWTPayload & {
  sub: string;
  typ?: string;
  azp?: string;
  preferred_username?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: KeycloakResourceAccess;
  scope?: string;
};

export type AuthenticatedUser = {
  id: string;
  sub: string;
  username?: string;
  email?: string;
  name?: string;
  roles: string[];
  realmRoles: string[];
  clientRoles: string[];
  token: KeycloakTokenPayload;
};

export type AuthenticatedRequest = Request & {
  accessToken?: string;
  user?: AuthenticatedUser;
};

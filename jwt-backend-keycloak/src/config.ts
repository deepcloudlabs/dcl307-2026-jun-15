import dotenv from "dotenv";

dotenv.config();

function readRequiredEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readOptionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function readNumberEnv(name: string, fallback: number): number {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${name} must be a number.`);
  }

  return parsed;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function csv(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const authServerUrl = trimTrailingSlash(
  readRequiredEnv("KEYCLOAK_AUTH_SERVER_URL", "http://localhost:8080"),
);
const realm = readRequiredEnv("KEYCLOAK_REALM", "demo");
const issuer = trimTrailingSlash(
  readOptionalEnv("KEYCLOAK_ISSUER") ?? `${authServerUrl}/realms/${realm}`,
);

export const config = {
  port: readNumberEnv("PORT", 4000),
  corsOrigin: readRequiredEnv("CORS_ORIGIN", "http://localhost:5173"),
  keycloak: {
    authServerUrl,
    realm,
    issuer,
    clientId: readRequiredEnv("KEYCLOAK_CLIENT_ID", "jwt-backend-api"),
    audience: readOptionalEnv("KEYCLOAK_AUDIENCE"),
    jwksUri:
      readOptionalEnv("KEYCLOAK_JWKS_URI") ??
      `${issuer}/protocol/openid-connect/certs`,
    allowedAlgorithms: csv(
      readRequiredEnv("KEYCLOAK_ALLOWED_ALGORITHMS", "RS256"),
    ),
    clockToleranceSeconds: readNumberEnv("KEYCLOAK_CLOCK_TOLERANCE_SECONDS", 5),
  },
};

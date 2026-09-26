import { AuthConfigurationError } from "./errors";

export type AuthMethod = "passkey" | "github" | "password";

const VALID_AUTH_METHODS: readonly AuthMethod[] = ["passkey", "github", "password"];

export interface AuthConfig {
  readonly methods: readonly AuthMethod[];
  readonly betterAuthSecret: string;
  readonly betterAuthUrl: string;
  readonly databasePath: string;
  readonly curatorSetupSecret: string;
  readonly passkey: {
    readonly rpId: string;
    readonly origin: string;
  };
  readonly github: {
    readonly clientId: string;
    readonly clientSecret: string;
  };
  readonly isProduction: boolean;
}

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseAuthMethods(raw: string | undefined): AuthMethod[] {
  const source = raw?.trim() || "passkey";
  const tokens = source
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) {
    throw new AuthConfigurationError(
      "AUTH_METHODS must include at least one method: passkey, github, password.",
    );
  }

  const methods: AuthMethod[] = [];
  for (const token of tokens) {
    if (!VALID_AUTH_METHODS.includes(token as AuthMethod)) {
      throw new AuthConfigurationError(
        `Invalid AUTH_METHODS value: "${token}". Allowed values: passkey, github, password.`,
      );
    }
    const method = token as AuthMethod;
    if (!methods.includes(method)) {
      methods.push(method);
    }
  }

  return methods;
}

function validateBetterAuthSecret(secret: string | undefined, isProduction: boolean): string {
  if (!secret) {
    if (isProduction) {
      throw new AuthConfigurationError(
        "BETTER_AUTH_SECRET is required in production. Generate one with: openssl rand -base64 32",
      );
    }
    return "development-only-secret-change-before-production-32chars";
  }

  if (secret.length < 32) {
    throw new AuthConfigurationError(
      "BETTER_AUTH_SECRET must be at least 32 characters.",
    );
  }

  return secret;
}

function validateBetterAuthUrl(url: string | undefined, isProduction: boolean): string {
  if (!url) {
    if (isProduction) {
      throw new AuthConfigurationError("BETTER_AUTH_URL is required in production.");
    }
    return "http://localhost:3000";
  }

  try {
    const parsed = new URL(url);
    if (isProduction && parsed.protocol !== "https:") {
      throw new AuthConfigurationError(
        "BETTER_AUTH_URL must use https in production.",
      );
    }
  } catch (error) {
    if (error instanceof AuthConfigurationError) {
      throw error;
    }
    throw new AuthConfigurationError(`BETTER_AUTH_URL is not a valid URL: ${url}`);
  }

  return url.replace(/\/$/, "");
}

function validatePasskeyConfig(
  methods: readonly AuthMethod[],
  isProduction: boolean,
): AuthConfig["passkey"] {
  if (!methods.includes("passkey")) {
    return { rpId: "localhost", origin: "http://localhost:3000" };
  }

  const rpId = readEnv("PASSKEY_RP_ID") ?? "localhost";
  const origin = readEnv("PASSKEY_ORIGIN") ?? readEnv("BETTER_AUTH_URL") ?? "http://localhost:3000";

  if (isProduction && origin.startsWith("http://")) {
    throw new AuthConfigurationError(
      "PASSKEY_ORIGIN must use https in production when passkey authentication is enabled.",
    );
  }

  try {
    const parsedOrigin = new URL(origin);
    if (parsedOrigin.hostname !== rpId && !parsedOrigin.hostname.endsWith(`.${rpId}`)) {
      throw new AuthConfigurationError(
        `PASSKEY_RP_ID (${rpId}) must match the hostname of PASSKEY_ORIGIN (${parsedOrigin.hostname}).`,
      );
    }
  } catch (error) {
    if (error instanceof AuthConfigurationError) {
      throw error;
    }
    throw new AuthConfigurationError(`PASSKEY_ORIGIN is not a valid URL: ${origin}`);
  }

  return { rpId, origin: origin.replace(/\/$/, "") };
}

function validateGitHubConfig(methods: readonly AuthMethod[]): AuthConfig["github"] {
  const clientId = readEnv("GITHUB_CLIENT_ID") ?? "";
  const clientSecret = readEnv("GITHUB_CLIENT_SECRET") ?? "";

  if (!methods.includes("github")) {
    return { clientId, clientSecret };
  }

  if (!clientId || !clientSecret) {
    throw new AuthConfigurationError(
      "GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are required when github is listed in AUTH_METHODS.",
    );
  }

  return { clientId, clientSecret };
}

function validateCuratorSetupSecret(secret: string | undefined, isProduction: boolean): string {
  if (!secret) {
    if (isProduction) {
      throw new AuthConfigurationError(
        "CURATOR_SETUP_SECRET is required in production.",
      );
    }
    return "development-only-curator-setup-secret";
  }

  if (secret.length < 16) {
    throw new AuthConfigurationError(
      "CURATOR_SETUP_SECRET must be at least 16 characters.",
    );
  }

  return secret;
}

function isStrictProductionValidation(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build" &&
    process.env.CUSEUM_ALLOW_HTTP !== "true"
  );
}

function loadAuthConfig(): AuthConfig {
  const isProduction = isStrictProductionValidation();
  const methods = parseAuthMethods(readEnv("AUTH_METHODS"));

  return Object.freeze({
    methods,
    betterAuthSecret: validateBetterAuthSecret(readEnv("BETTER_AUTH_SECRET"), isProduction),
    betterAuthUrl: validateBetterAuthUrl(readEnv("BETTER_AUTH_URL"), isProduction),
    databasePath: readEnv("DATABASE_PATH") ?? "./data/cuseum.db",
    curatorSetupSecret: validateCuratorSetupSecret(readEnv("CURATOR_SETUP_SECRET"), isProduction),
    passkey: validatePasskeyConfig(methods, isProduction),
    github: validateGitHubConfig(methods),
    isProduction: isStrictProductionValidation(),
  });
}

/** Parsed and validated auth configuration. Throws on invalid startup configuration. */
export const authConfig: AuthConfig = loadAuthConfig();

/** Enabled authentication methods in configured order. */
export const enabledAuthMethods: readonly AuthMethod[] = authConfig.methods;

export function isAuthMethodEnabled(method: AuthMethod): boolean {
  return authConfig.methods.includes(method);
}

/** Safe summary for client rendering — never includes secrets. */
export function getPublicAuthConfig() {
  return {
    methods: enabledAuthMethods,
  };
}

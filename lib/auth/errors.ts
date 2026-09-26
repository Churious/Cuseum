/** Thrown when auth-related environment configuration is invalid or incomplete. */
export class AuthConfigurationError extends Error {
  readonly name = "AuthConfigurationError";

  constructor(message: string) {
    super(message);
  }
}

/** Thrown when a protected operation requires an authenticated Curator session. */
export class CuratorAuthorizationError extends Error {
  readonly name = "CuratorAuthorizationError";

  constructor(message = "Curator session required.") {
    super(message);
  }
}

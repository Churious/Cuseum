import { isAuthMethodEnabled } from "../config";

export function getEmailPasswordOptions() {
  if (!isAuthMethodEnabled("password")) {
    return { enabled: false as const };
  }

  return {
    enabled: true as const,
    disableSignUp: true,
  };
}

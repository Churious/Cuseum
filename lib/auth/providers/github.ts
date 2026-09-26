import { isAuthMethodEnabled, authConfig } from "../config";

export function getGitHubSocialProvider() {
  if (!isAuthMethodEnabled("github")) {
    return undefined;
  }

  return {
    clientId: authConfig.github.clientId,
    clientSecret: authConfig.github.clientSecret,
  };
}

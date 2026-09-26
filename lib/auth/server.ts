import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { authConfig } from "./config";
import { getAuthDatabase } from "./database";
import { createPasskeyPlugin } from "./providers/passkey";
import { getGitHubSocialProvider } from "./providers/github";
import { getEmailPasswordOptions } from "./providers/password";

const passkeyPlugin = createPasskeyPlugin();
const githubProvider = getGitHubSocialProvider();
const emailPassword = getEmailPasswordOptions();

const plugins = [
  ...(passkeyPlugin ? [passkeyPlugin] : []),
  nextCookies(),
];

export const auth = betterAuth({
  appName: "Cuseum",
  secret: authConfig.betterAuthSecret,
  baseURL: authConfig.betterAuthUrl,
  database: getAuthDatabase(),
  emailAndPassword: emailPassword,
  socialProviders: githubProvider ? { github: githubProvider } : undefined,
  plugins,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;

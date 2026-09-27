import { auth } from "../lib/auth/server.ts";

const ctx = await auth.$context;
console.log(
  JSON.stringify(
    {
      keys: Object.keys(ctx).sort(),
      authCookieKeys: ctx.authCookies ? Object.keys(ctx.authCookies) : null,
    },
    null,
    2,
  ),
);

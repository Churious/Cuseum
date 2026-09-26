import { auth } from "./server";

/** Creates the first Curator email/password credential during setup only. */
export async function createPasswordCuratorUser(email: string, password: string) {
  const ctx = await auth.$context;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await ctx.internalAdapter.findUserByEmail(normalizedEmail);
  if (existing?.user) {
    throw new Error("A user with this email already exists.");
  }

  const hash = await ctx.password.hash(password);
  const createdUser = await ctx.internalAdapter.createUser(
    {
      email: normalizedEmail,
      name: "Curator",
      emailVerified: true,
    },
    { method: "email-password" },
  );

  if (!createdUser) {
    throw new Error("Could not create Curator account.");
  }

  await ctx.internalAdapter.linkAccount({
    userId: createdUser.id,
    providerId: "credential",
    accountId: createdUser.id,
    password: hash,
  });

  return createdUser;
}

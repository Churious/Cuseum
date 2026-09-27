import { getCuratorUserId } from "./curator";
import { auth } from "./server";

/** Adds or replaces the Curator email/password credential for recovery. */
export async function addPasswordToCuratorUser(email: string, password: string) {
  const ctx = await auth.$context;
  const userId = getCuratorUserId();

  if (!userId) {
    throw new Error("Curator is not configured.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const accounts = await ctx.adapter.findMany({
    model: "account",
    where: [
      { field: "userId", value: userId },
      { field: "providerId", value: "credential" },
    ],
  });
  const existingAccount = accounts[0] as { id: string } | undefined;

  const hash = await ctx.password.hash(password);

  await ctx.internalAdapter.updateUser(userId, {
    email: normalizedEmail,
    emailVerified: true,
    name: "Curator",
  });

  if (existingAccount) {
    await ctx.internalAdapter.updateAccount(existingAccount.id, {
      accountId: userId,
      password: hash,
    });
    return;
  }

  await ctx.internalAdapter.linkAccount({
    userId,
    providerId: "credential",
    accountId: userId,
    password: hash,
  });
}

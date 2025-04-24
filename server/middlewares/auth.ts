import { createMiddleware } from "hono/factory";

import { type User } from "@/lib/types";
import { validateSessionToken } from "@/server/services/auth";
import { deleteSessionCookie, getSessionCookie } from "@/server/utils/cookie";

type AuthVariable = {
  user: User;
};

export const requireAuth = () => {
  return createMiddleware<{
    Variables: AuthVariable;
  }>(async (c, next) => {
    const token = await getSessionCookie(c);
    if (!token) {
      return c.json({ error: "Not authorized." }, 403);
    }

    const { user } = await validateSessionToken(token);
    if (!user) {
      deleteSessionCookie(c);
      return c.json({ error: "Not authorized." }, 403);
    }
    c.set("user", user);
    await next();
  });
};

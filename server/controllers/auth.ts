import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, signupSchema } from "@/lib/schemas/auth";
import * as authService from "@/server/services/auth";
import {
  deleteSessionCookie,
  getSessionCookie,
  setSessionCookie,
} from "@/server/utils/cookie";

const AuthApp = new Hono()
  .post("/signup", zValidator("json", signupSchema), async (c) => {
    const { username, password, fullName } = c.req.valid("json");
    try {
      const user = await authService.createUser(username, fullName, password);
      const token = authService.generateSessionToken();
      const session = await authService.createSession(token, user.id);
      setSessionCookie(c, token, session.expiresAt);
      return c.json({ success: true, redirectUrl: "/" });
    } catch (err) {
      console.log(err);
      return c.json(
        {
          success: false,
          error: "An error occurred while creating your account.",
        },
        400,
      );
    }
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { username, password } = c.req.valid("json");
    const user = await authService.validateUser(username, password);
    if (!user) return c.json({ error: "Invalid login." }, 401);

    const token = authService.generateSessionToken();
    const session = await authService.createSession(token, user.id);
    setSessionCookie(c, token, session.expiresAt);
    return c.json({ success: true, redirectUrl: "/" });
  })
  .post("/logout", async (c) => {
    const token = await getSessionCookie(c);
    if (token) {
      const { session } = await authService.validateSessionToken(token);
      if (session) {
        await authService.invalidateSession(session.id);
      }
    }
    deleteSessionCookie(c);
    return c.redirect("/login");
  });

export default AuthApp;

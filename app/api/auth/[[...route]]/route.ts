import { Hono } from "hono";
import { handle } from "hono/vercel";
import AuthApp from "@/server/controllers/auth";
import { initGlobalMiddleware } from "@/server/middlewares";

const app = initGlobalMiddleware(new Hono().basePath("/api/auth")).route(
  "/",
  AuthApp,
);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;

import { Hono } from "hono";
import { handle } from "hono/vercel";

import ArticleApp from "@/server/controllers/articles";
import CardApp from "@/server/controllers/cards";
import NoteApp from "@/server/controllers/notes";
import { initGlobalMiddleware } from "@/server/middlewares";
import { requireAuth } from "@/server/middlewares/auth";

// edge runtime doesn't support file link
// export const runtime = "edge";

const app = initGlobalMiddleware(new Hono().basePath("/api"));

app.use(requireAuth());

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- declare for type
const routes = app
  .route("/notes", NoteApp)
  .route("/articles", ArticleApp)
  .route("/cards", CardApp);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;

import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { trimTrailingSlash } from "hono/trailing-slash";
import { handle } from "hono/vercel";
import ArticleApp from "@/server/controllers/articles";
import NoteApp from "@/server/controllers/notes";

// edge runtime doesn't support file link
// export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use(csrf());
app.use(cors());
app.use(logger());
app.use(prettyJSON());
app.use(trimTrailingSlash());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/articles", ArticleApp).route("/notes", NoteApp);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;

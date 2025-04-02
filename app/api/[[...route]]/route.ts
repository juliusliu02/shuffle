import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { trimTrailingSlash } from "hono/trailing-slash";
import { handle } from "hono/vercel";
import ArticleApp from "@/lib/controllers/articles";

// edge runtime doesn't support file link
// export const runtime = "edge";

const app = new Hono()
  .basePath("/api")
  .route("/articles", ArticleApp);

app.use(csrf());
app.use(cors());
app.use(logger());
app.use(prettyJSON());
app.use(trimTrailingSlash());

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;

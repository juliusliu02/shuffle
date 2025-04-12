import type { Hono, Schema } from "hono";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { trimTrailingSlash } from "hono/trailing-slash";
import type { Context } from "hono";
import type { BlankEnv, BlankSchema, HTTPResponseError } from "hono/types";

function systemException() {
  return (err: Error | HTTPResponseError, c: Context) => {
    console.error(err);
    return c.json({ message: "Internal Server Error", error: err }, 500);
  };
}

export const initGlobalMiddleware = <
  E extends BlankEnv,
  S extends Schema = BlankSchema,
  BasePath extends string = "/",
>(
  app: Hono<E, S, BasePath>,
) => {
  if (process.env.NODE_ENV === "production") {
    app.use(csrf());
  }
  app.use(cors());
  app.use(logger());
  app.use(prettyJSON());
  app.use(trimTrailingSlash());

  app.onError(systemException());
  return app;
};

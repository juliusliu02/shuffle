import { drizzle } from "drizzle-orm/libsql";

import * as articleSchema from "./schema/articles";

export const db = drizzle({
  connection: process.env.DB_FILE_NAME!,
  casing: "snake_case",
  schema: { ...articleSchema },
});

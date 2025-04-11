import { HighlightInsert } from "@/lib/types";
import { db } from "../db";
import { highlightsTable } from "@/server/db/schema/articles";

export const createHighlights = (data: HighlightInsert[]) => {
  return db.insert(highlightsTable).values(data).returning();
};

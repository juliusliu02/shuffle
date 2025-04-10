import { HighlightInsert } from "@/lib/models";
import { db } from "../db";
import { highlightsTable } from "@/server/db/schema";

export const createHighlights = (data: HighlightInsert[]) => {
  return db.insert(highlightsTable).values(data).returning();
};

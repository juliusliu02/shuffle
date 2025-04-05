import { HighlightInsert } from "@/lib/models";
import { db } from "@/lib/db";
import { highlightsTable } from "@/lib/db/schema";

export const createHighlights = (data: HighlightInsert[]) => {
  return db.insert(highlightsTable).values(data).returning();
};

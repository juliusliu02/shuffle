import { desc, eq } from "drizzle-orm";
import type { ReviewLog } from "ts-fsrs";

import { db } from "@/server/db";
import { revlogsTable } from "@/server/db/schema/flashcards";

export const createRevlog = async (
  cid: number,
  uid: number,
  revlogData: ReviewLog,
) => {
  return db.insert(revlogsTable).values({ ...revlogData, cid, uid });
};

export const getLatestRevlog = async (cid: number) => {
  return db
    .select()
    .from(revlogsTable)
    .where(eq(revlogsTable.cid, cid))
    .orderBy(desc(revlogsTable.review))
    .limit(1);
};

export const deleteRevlog = async (id: number) => {
  return db.delete(revlogsTable).where(eq(revlogsTable.id, id));
};

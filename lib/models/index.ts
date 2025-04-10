import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";
import * as schema from "@/server/db/schema";

export type Article = typeof schema.articlesTable.$inferSelect;
export type ArticleInsert = Omit<
  typeof schema.articlesTable.$inferInsert,
  "id"
>;

export type Note = typeof schema.notesTable.$inferSelect;
export type NoteInsert = Omit<typeof schema.notesTable.$inferInsert, "id">;

export type Highlight = typeof schema.highlightsTable.$inferSelect;
export type HighlightInsert = Omit<
  typeof schema.highlightsTable.$inferInsert,
  "id"
>;

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

// Reference: https://github.com/drizzle-team/drizzle-orm/issues/695#issuecomment-1881454650
export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type NoteWithHighlights = InferResultType<
  "notesTable",
  { highlights: true }
>;

export type ArticleWithNotesAndHighlights = InferResultType<
  "articlesTable",
  {
    notes: {
      with: {
        highlights: true;
      };
    };
  }
>;

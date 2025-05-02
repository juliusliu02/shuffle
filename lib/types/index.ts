import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";

// ensure this is a type-only file
import type * as articleSchema from "@/server/db/schema/articles";
import type * as authSchema from "@/server/db/schema/auth";
import type * as flashcardsSchema from "@/server/db/schema/flashcards";

export type ArticleSelect = typeof articleSchema.articlesTable.$inferSelect;
export type ArticleInsert = Omit<
  typeof articleSchema.articlesTable.$inferInsert,
  "id"
>;
export type ArticleListItem = Pick<ArticleSelect, "id" | "title" | "createdAt">;

export type NoteSelect = typeof articleSchema.notesTable.$inferSelect;
export type NoteInsert = Omit<
  typeof articleSchema.notesTable.$inferInsert,
  "id"
>;

export type NoteInsertWithHighlights = NoteInsert & {
  highlights: Omit<HighlightInsert, "noteId">[];
};

export type HighlightSelect = typeof articleSchema.highlightsTable.$inferSelect;
export type HighlightInsert = Omit<
  typeof articleSchema.highlightsTable.$inferInsert,
  "id"
>;

export type User = Omit<
  typeof authSchema.usersTable.$inferSelect,
  "hashedPassword"
>;
export type Session = typeof authSchema.sessionsTable.$inferSelect;

type Schema = typeof articleSchema &
  typeof authSchema &
  typeof flashcardsSchema;
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

export type CardSelect = typeof flashcardsSchema.cardsTable.$inferSelect;
export type CardInsert = Omit<CardSelect, "id">;

export type CardWithNoteWithArticle = InferResultType<
  "cardsTable",
  {
    note: {
      with: {
        article: true;
      };
    };
  }
>;

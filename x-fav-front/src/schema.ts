import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const likesTable = sqliteTable("likes", {
  id: integer("id").primaryKey(),
  link: text("link").notNull(),
  created_at: text("created_at").notNull(),
});

import { pgTable, integer, serial, text, timestamp } from "drizzle-orm/pg-core";

export type User = typeof user.$inferSelect;
export const user = pgTable("user", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
});

export type Session = typeof session.$inferSelect;
export const session = pgTable("session", {
    id: text("id").primaryKey(),

    userId: integer("user_id")
        .notNull()
        .references(() => user.id),

    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
});

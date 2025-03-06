import { date, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const championTable = pgTable("champion", {
	id: integer().primaryKey(),
	name: text().notNull(),
	image: text().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().$onUpdate(() => new Date()),
});

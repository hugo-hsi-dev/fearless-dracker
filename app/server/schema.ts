import { Relation, relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import type { z } from "zod";

// Tables
export const roomTable = pgTable("rooms", {
	id: text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const usedChampionTable = pgTable("disabled_champions", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	championId: text().notNull(),
	roomId: text()
		.notNull()
		.references(() => roomTable.id),
	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

// Relations
export const roomRelation = relations(roomTable, ({ many }) => ({
	disabledChampions: many(usedChampionTable),
}));

export const disabledChampionRelation = relations(
	usedChampionTable,
	({ one }) => ({
		room: one(roomTable, {
			fields: [usedChampionTable.roomId],
			references: [roomTable.id],
		}),
	}),
);

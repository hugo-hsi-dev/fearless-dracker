import { run } from '@/features/run/schemas/tables';
import { relations } from 'drizzle-orm';
import {
	date,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';

export const champion = pgTable('champion', {
	id: integer().primaryKey(),
	name: text().notNull(),
	image: text().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().$onUpdate(() => new Date()),
});

export const championRelations = relations(champion, ({ many }) => ({
	reserved: many(reservedChampion),
}));

export const reservedChampion = pgTable(
	'reserved_champion',
	{
		championId: integer()
			.notNull()
			.references(() => champion.id),
		runId: text()
			.notNull()
			.references(() => run.id),
		createdAt: timestamp().defaultNow().notNull(),
		updatedAt: timestamp().$onUpdate(() => new Date()),
	},
	(t) => [primaryKey({ columns: [t.championId, t.runId] })],
);

export const reservedChampionRelations = relations(
	reservedChampion,
	({ one }) => ({
		champion: one(champion, {
			fields: [reservedChampion.championId],
			references: [champion.id],
		}),
		run: one(run, {
			fields: [reservedChampion.runId],
			references: [run.id],
		}),
	}),
);

import { user } from '@/features/auth/schemas/tables';
import { run } from '@/features/run/schemas/tables';
import { relations } from 'drizzle-orm';
import {
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['owner', 'member']);

export const member = pgTable(
	'member',
	{
		userId: text()
			.notNull()
			.references(() => user.id),
		runId: text()
			.notNull()
			.references(() => run.id),
		role: roleEnum().notNull().default('member'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
	},
	(t) => [primaryKey({ columns: [t.userId, t.runId] })],
);

export const memberRelations = relations(member, ({ one }) => ({
	run: one(run, {
		fields: [member.runId],
		references: [run.id],
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id],
	}),
}));

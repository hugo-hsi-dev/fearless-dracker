import { user } from '@/features/auth/schemas/tables';
import { reservedChampion } from '@/features/champion/schemas/tables';
import { member } from '@/features/member/schemas/tables';
import { relations } from 'drizzle-orm';
import {
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';
import { customAlphabet, nanoid } from 'nanoid';

export const statusConfig = ['active', 'completed', 'archived'] as const;
export const statusEnum = pgEnum('status', statusConfig);

export const run = pgTable('run', {
	id: text()
		.primaryKey()
		.$default(() => nanoid()),
	name: text('name').notNull(),
	code: text()
		.unique()
		.notNull()
		.$default(() => customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ1234567890', 6)()),
	status: statusEnum().notNull().default('active'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});

export const runRelations = relations(run, ({ many }) => ({
	members: many(member),
	reserved: many(reservedChampion),
}));

export const roleEnum = pgEnum('role', ['owner', 'member']);

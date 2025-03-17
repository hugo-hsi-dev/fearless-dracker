import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from 'drizzle-zod';
import type { z } from 'zod';
import { run } from './tables';

export const createRunSchema = createInsertSchema(run, {
	name: (schema) => schema.min(3).max(100).trim(),
}).pick({ name: true });
export type CreateRunSchema = z.infer<typeof createRunSchema>;

export const getRunListSchema = createSelectSchema(run).pick({ status: true });
export type GetRunListSchema = z.infer<typeof getRunListSchema>;

export const getRunDetailSchema = createSelectSchema(run).pick({ code: true });
export type GetRunDetailSchema = z.infer<typeof getRunDetailSchema>;

export const updateRunStatusSchema = createUpdateSchema(run)
	.pick({
		status: true,
		code: true,
	})
	.required();
export type UpdateRunStatusSchema = z.infer<typeof updateRunStatusSchema>;

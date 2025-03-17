import { run } from '@/features/run/schemas/tables';
import { createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import type { z } from 'zod';
import { reservedChampion } from './tables';

export const getChampionAvailabilitiesSchema = createSelectSchema(run).pick({
	code: true,
	name: true,
});
export type GetChampionAvailabilitiesSchema = z.infer<
	typeof getChampionAvailabilitiesSchema
>;

export const getReservedChampionsSchema = createSelectSchema(run).pick({
	code: true,
});
export type GetReservedChampionsSchema = z.infer<
	typeof getReservedChampionsSchema
>;

export const toggleChampionSchema = createUpdateSchema(reservedChampion)
	.pick({
		championId: true,
	})
	.merge(createUpdateSchema(run).pick({ code: true }))
	.required();
export type ToggleChampionSchema = z.infer<typeof toggleChampionSchema>;

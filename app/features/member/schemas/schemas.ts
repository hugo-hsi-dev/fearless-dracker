import { member, run } from '@/features/run/schemas/tables';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const getMemberListSchema = createSelectSchema(run).pick({
	code: true,
});

export type GetMemberListSchema = z.infer<typeof getMemberListSchema>;

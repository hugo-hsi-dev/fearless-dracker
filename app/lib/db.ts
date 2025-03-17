import * as authSchema from '@/features/auth/schemas/tables';
import * as championSchema from '@/features/champion/schemas/tables';
import * as memberSchema from '@/features/member/schemas/tables';
import * as runSchema from '@/features/run/schemas/tables';
import { env } from '@/lib/env';
import { drizzle } from 'drizzle-orm/node-postgres';

const schema = {
	...authSchema,
	...runSchema,
	...memberSchema,
	...championSchema,
};

export const db = drizzle(env.DATABASE_URL, { schema, casing: 'snake_case' });

import { env } from '@/lib/env';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
	casing: 'snake_case',
	out: './drizzle',
	schema: './app/features/**/schemas/tables.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});

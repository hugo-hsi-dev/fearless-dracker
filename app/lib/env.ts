import z from "zod";
export const env = z
	.object({
		DATABASE_URL: z.string().url(),
		DISCORD_CLIENT_ID: z.string(),
		DISCORD_CLIENT_SECRET: z.string(),
	})
	.parse(process.env);

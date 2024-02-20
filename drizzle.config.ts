import type { Config } from 'drizzle-kit';

import 'dotenv/config';

export default {
	schema: './src/db/schema.ts',
	out: './drizzle',
	driver: 'pg', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
	dbCredentials: {
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST as string,
		port: +(process.env.DB_PORT as string),
		database: process.env.DB_NAME as string
	}
} satisfies Config;

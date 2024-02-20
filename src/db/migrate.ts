import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { dbConnection } from './db';

const migrationClient = postgres(dbConnection);
migrate(drizzle(migrationClient), { migrationsFolder: 'drizzle' });

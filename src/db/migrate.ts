import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { connection, DB } from './db';

migrate(DB, { migrationsFolder: 'drizzle' });
connection.close();

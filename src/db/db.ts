import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export const connection = new Database('sqlite.db');

export const DB = drizzle(connection, { schema });

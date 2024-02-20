import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { dbConnection } from './db';

const migrationClient = postgres(dbConnection);

(async () => {
	for (let i = 0; i < 3; i++) {
		try {
			await migrate(drizzle(migrationClient), { migrationsFolder: 'drizzle' });
			break;
		} catch (e) {
			i++;
			console.log('Error migrating to database, Error: ', e);
		}

		if (i === 5) {
			console.error('Migration failed after 5 attempts');
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
})();

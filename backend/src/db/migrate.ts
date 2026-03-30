import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const runMigrations = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable not set');
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations completed!');
  process.exit(0);
};

runMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});

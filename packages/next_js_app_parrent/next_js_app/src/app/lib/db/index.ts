import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from 'pg';

export let db: NodePgDatabase | undefined;

async function initializeDb(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in the environment variables');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  await pool.query('SELECT NOW()');

  db = drizzle(pool);
}

export async function getDb(): Promise<NodePgDatabase> {
  if (!db) {
    await initializeDb();
  }
  
  if (typeof db === 'undefined') {
    throw new Error('Database instance is not initialized');
  }

  return db;
}


export async function ensureDbInitialized(): Promise<void> {
    if (!db) {
      await initializeDb();
    }
  }
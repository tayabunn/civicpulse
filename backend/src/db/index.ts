import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_placeholder@ep-cool-sample.us-east-2.aws.neon.tech/neondb?sslmode=require';

// Neon requires SSL. This client automatically handles SSL for Neon and standard connections.
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: connectionString.includes('neon.tech') ? 'require' : false,
});

export const db = drizzle(client, { schema });
export { schema };

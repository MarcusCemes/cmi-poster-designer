import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";

const databaseUrl = env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/local";

const client = postgres(databaseUrl);

export const db = drizzle(client, { schema });

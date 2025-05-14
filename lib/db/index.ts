import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import * as schema from "./schema"

// Create a Neon client
const sql = neon(process.env.DATABASE_URL!)

// Create a Drizzle client
export const db = drizzle(sql, { schema })

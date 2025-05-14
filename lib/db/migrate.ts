import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

// This script will be run separately to migrate the database
async function runMigration() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined")
  }

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  console.log("Running migrations...")

  await migrate(db, { migrationsFolder: "drizzle" })

  console.log("Migrations completed!")

  process.exit(0)
}

runMigration().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})

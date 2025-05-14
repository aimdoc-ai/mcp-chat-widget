import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "../lib/db/schema"

// Load environment variables
require("dotenv").config()

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined")
  }

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql, { schema })

  console.log("Running migrations...")

  // Create tables based on schema
  await db
    .insert(schema.widgets)
    .values({
      name: "Demo Widget",
      description: "A demo chat widget with OpenAI integration",
      systemPrompt: "You are a helpful assistant. Answer questions concisely and accurately.",
      defaultProvider: "openai",
      position: "bottom-right",
      size: "md",
    })
    .onConflictDoNothing()

  console.log("Migrations completed!")
}

main().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})

import { pgTable, serial, text, boolean, timestamp, json, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Widget table - stores the main widget configuration
export const widgets = pgTable("widgets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  systemPrompt: text("system_prompt"),
  defaultProvider: varchar("default_provider", { length: 50 }).default("openai"),
  position: varchar("position", { length: 50 }).default("bottom-right"),
  size: varchar("size", { length: 10 }).default("md"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Widget MCP servers - stores MCP server configurations for each widget
export const widgetMcpServers = pgTable("widget_mcp_servers", {
  id: serial("id").primaryKey(),
  widgetId: serial("widget_id").references(() => widgets.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  type: varchar("type", { length: 10 }).default("sse"),
  isDefault: boolean("is_default").default(false),
  headers: json("headers").$type<Record<string, string>>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Widget conversations - stores conversations for each widget instance
export const widgetConversations = pgTable("widget_conversations", {
  id: serial("id").primaryKey(),
  widgetId: serial("widget_id").references(() => widgets.id),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Widget messages - stores messages for each conversation
export const widgetMessages = pgTable("widget_messages", {
  id: serial("id").primaryKey(),
  conversationId: serial("conversation_id").references(() => widgetConversations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).notNull(), // 'user', 'assistant', 'system'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

// Define relations
export const widgetsRelations = relations(widgets, ({ many }) => ({
  mcpServers: many(widgetMcpServers),
  conversations: many(widgetConversations),
}))

export const widgetConversationsRelations = relations(widgetConversations, ({ one, many }) => ({
  widget: one(widgets, {
    fields: [widgetConversations.widgetId],
    references: [widgets.id],
  }),
  messages: many(widgetMessages),
}))

export const widgetMessagesRelations = relations(widgetMessages, ({ one }) => ({
  conversation: one(widgetConversations, {
    fields: [widgetMessages.conversationId],
    references: [widgetConversations.id],
  }),
}))

export const widgetMcpServersRelations = relations(widgetMcpServers, ({ one }) => ({
  widget: one(widgets, {
    fields: [widgetMcpServers.widgetId],
    references: [widgets.id],
  }),
}))

// Types
export type Widget = typeof widgets.$inferSelect
export type NewWidget = typeof widgets.$inferInsert

export type WidgetMcpServer = typeof widgetMcpServers.$inferSelect
export type NewWidgetMcpServer = typeof widgetMcpServers.$inferInsert

export type WidgetConversation = typeof widgetConversations.$inferSelect
export type NewWidgetConversation = typeof widgetConversations.$inferInsert

export type WidgetMessage = typeof widgetMessages.$inferSelect
export type NewWidgetMessage = typeof widgetMessages.$inferInsert

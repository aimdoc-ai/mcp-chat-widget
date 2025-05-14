CREATE TABLE "widget_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"widget_id" serial NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "widget_mcp_servers" (
	"id" serial PRIMARY KEY NOT NULL,
	"widget_id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"type" varchar(10) DEFAULT 'sse',
	"is_default" boolean DEFAULT false,
	"headers" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "widget_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" serial NOT NULL,
	"role" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "widgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"system_prompt" text,
	"default_provider" varchar(50) DEFAULT 'openai',
	"position" varchar(50) DEFAULT 'bottom-right',
	"size" varchar(10) DEFAULT 'md',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "widget_conversations" ADD CONSTRAINT "widget_conversations_widget_id_widgets_id_fk" FOREIGN KEY ("widget_id") REFERENCES "public"."widgets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "widget_mcp_servers" ADD CONSTRAINT "widget_mcp_servers_widget_id_widgets_id_fk" FOREIGN KEY ("widget_id") REFERENCES "public"."widgets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "widget_messages" ADD CONSTRAINT "widget_messages_conversation_id_widget_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."widget_conversations"("id") ON DELETE cascade ON UPDATE no action;
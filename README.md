# ChatMCP Widgets

![ChatMCP Widgets](https://img.shields.io/badge/ChatMCP-Widgets-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

A lightweight self-hosted platform for hosting and configuring MCP-enabled chat widgets remotely. Deploy, create and manage AI chat widgets to embed on your website. Add an MCP client toyour websites, dashboards, and applications with access to advanced AI models and external tools.

[Watch Demo 1 ](https://stream.new/v/CvQxjzLQ66402W90000neGB7YxAPIdRMxRspzQkO9hRwNI) | 
[Watch Demo 2 ](https://stream.new/v/CvQxjzLQ66402W90000neGB7YxAPIdRMxRspzQkO9hRwNI) 
```
┌─────────────────────────────────────────┐
│                                         │
│  ChatMCP Widgets                     ×  │
│ ┌─────────────────────────────────────┐ │
│ │ AI Assistant                        │ │
│ │                                     │ │
│ │ Hello! How can I help you today?    │ │
│ │                                     │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ Tell me about MCP tools.        │ │ │
│ │ └─────────────────────────────────┘ │ │
│ │                                     │ │
│ │ MCP tools provide powerful          │ │
│ │ capabilities like file access,      │ │
│ │ API integrations, database          │ │
│ │ connections, and more.              │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Message                          ▶  │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## 🌟 Features

- **Customizable Widgets**: Create chat widgets with custom positions, sizes, and AI providers.
- **MCP Tool Support**: Connect to MCP servers to give your chat widgets access to powerful tools like file access, API integrations, and more.
- **Multiple Providers**: Choose between OpenAI and Anthropic models for each widget.
- **Conversation History**: Chat history is automatically saved for each session. Users can continue conversations where they left off.
- **Easy Integration**: Simple embed code to add widgets to any website or application.
- **Responsive Design**: Chat widgets work seamlessly on desktop and mobile devices.

## 📋 Requirements

- Node.js 18.x or later
- PostgreSQL database
- OpenAI API key (for OpenAI provider)
- Anthropic API key (for Anthropic provider)
- MCP server endpoints (optional, for tool capabilities)

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chatmcp-widgets.git
   cd chatmcp-widgets
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/chatmcp"
   OPENAI_API_KEY="your-openai-api-key"
   ANTHROPIC_API_KEY="your-anthropic-api-key"
   NEXTAUTH_SECRET="your-auth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### Database Setup

This project uses Drizzle ORM with PostgreSQL. The database schema is defined in `lib/db/schema.ts`.

```bash
# Generate migration files based on your schema
pnpm db:generate

# Push schema changes directly to the database (for development)
pnpm db:push

# Run migrations
pnpm db:migrate

# Open Drizzle Studio to view and edit your database
pnpm db:studio
```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧰 Usage

### Creating a Chat Widget

1. Navigate to the Admin dashboard at `/admin`
2. Click "New Widget" to create a new chat widget
3. Configure the following settings:
   - Name: A descriptive name for your widget
   - Description: (Optional) A brief description
   - Default Provider: Choose between OpenAI and Anthropic
   - Position: Select where the widget should appear on the page
   - Size: Choose the size of the chat widget
   - System Prompt: Define the behavior and capabilities of your assistant

### MCP Server Configuration

To enable tool capabilities, you can connect your widget to one or more MCP servers:

1. In the widget creation/edit form, add a new MCP server
2. Configure the server settings:
   - Server Name: A descriptive name for the server
   - Server URL: The endpoint URL for your MCP server
   - Server Type: Choose between SSE (Server-Sent Events) or HTTP
   - Default Server: Set as default if you have multiple servers

### Testing Your Widget

1. Navigate to the Demo page at `/demo`
2. Enter your widget ID (found in the admin dashboard)
3. Click "Load Widget" to test your chat widget in real-time

### Embedding Your Widget

To embed a chat widget on your website, add the following code to your HTML:

```html
<script src="https://your-chatmcp-domain.com/widget.js" defer></script>
<script>
  window.addEventListener('load', function() {
    ChatMCPWidget.init({
      widgetId: YOUR_WIDGET_ID,
    });
  });
</script>
```

Replace `YOUR_WIDGET_ID` with the ID of your chat widget from the admin dashboard.

## 🧩 Architecture

ChatMCP Widgets is built with:

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **Drizzle ORM**: For database interactions with PostgreSQL
- **shadcn/ui**: Component library for modern UI elements
- **Tailwind CSS**: Utility-first CSS framework for styling

## 📝 License

[MIT](LICENSE)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support or questions, please open an issue in the GitHub repository or contact the maintainers.

# Chat Widget History Functionality

This document describes the chat history functionality added to the MCP Chat Widget.

## Overview

The chat history feature allows users to:
- View a list of their past conversations
- Load a previous conversation
- Delete unwanted conversations
- Start new conversations

## Database Schema

The chat history relies on two main tables in the database:

1. `widgetConversations`: Stores metadata about each conversation
   - `id`: Unique identifier for the conversation
   - `widgetId`: Reference to the widget this conversation belongs to
   - `sessionId`: Unique session identifier for the user
   - `createdAt`: When the conversation was created
   - `updatedAt`: When the conversation was last updated

2. `widgetMessages`: Stores the individual messages in each conversation
   - `id`: Unique identifier for the message
   - `conversationId`: Reference to the conversation this message belongs to
   - `role`: The role of the message sender ('user', 'assistant', 'system')
   - `content`: The message content
   - `createdAt`: When the message was created

## API Routes

The following API routes are available for managing chat history:

### Conversations

- `GET /api/widgets/[id]/conversations`
  - Returns a list of conversations for a widget
  - Each conversation includes a preview of the last message
  - Conversations are ordered by `updatedAt` (newest first)
  - For each conversation, the most recent message is included for the preview

- `POST /api/widgets/[id]/conversations`
  - Creates a new conversation for a widget
  - Requires a `sessionId` in the request body

- `GET /api/widgets/[id]/conversations/[conversationId]`
  - Returns details about a specific conversation
  - Includes all messages in the conversation

- `DELETE /api/widgets/[id]/conversations/[conversationId]`
  - Deletes a conversation and all its messages

### Messages

- `GET /api/widgets/[id]/conversations/[conversationId]/messages`
  - Returns all messages for a specific conversation
  - Messages are ordered by `createdAt` (oldest first) to maintain the chronological flow of the conversation

- `POST /api/widgets/[id]/conversations/[conversationId]/messages`
  - Adds a new message to a conversation
  - Requires `role` and `content` in the request body
  - Updates the conversation's `updatedAt` timestamp to ensure accurate sorting

## UI Implementation

The chat history UI is implemented in the `WidgetChat` component, which provides:

1. A history toggle button in the chat header
2. A history view that displays a list of past conversations
3. The ability to click on a conversation to load it
4. The ability to delete a conversation
5. A button to start a new conversation

## Session Management

The widget uses cookies to maintain user sessions:
- A cookie named `widget_[id]_session` stores the session ID
- The cookie has a 30-day expiration
- New conversations are associated with this session ID
- When a user starts a conversation, the widget checks for an existing conversation with the same session ID

## Code Structure

- `/app/api/widgets/[id]/conversations/route.ts`: API route for listing and creating conversations
- `/app/api/widgets/[id]/conversations/[conversationId]/route.ts`: API route for managing a specific conversation
- `/app/api/widgets/[id]/conversations/[conversationId]/messages/route.ts`: API route for managing messages in a conversation
- `/components/widget-chat.tsx`: UI component with chat history functionality

## Implementation Notes

- When displaying conversation previews, we use the most recent message (ordered by `createdAt`)
- When displaying messages within a conversation, we sort by `createdAt` in ascending order to show the oldest messages first
- Each API endpoint includes proper error handling and validation
- The chat component maintains state to track whether it's showing chat history or an active conversation

## Future Improvements

Potential future improvements to the chat history functionality could include:

1. Conversation naming and organization
2. Sharing conversations between users
3. Exporting conversations as text/PDF
4. Chat history search capabilities
5. Analytics on chat usage and patterns
6. Pagination for users with many conversations
7. Message grouping for better UI presentation 
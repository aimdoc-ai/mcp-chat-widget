# MCP Fullscreen Chat Web Component

This document describes how the MCP Fullscreen Chat is exported as a web component, making it easy to embed a fullscreen chat interface on any website.

## Overview

The MCP Fullscreen Chat is built with React and exported as a native web component (custom element) using the `@r2wc/react-to-web-component` package. This approach allows the fullscreen chat interface to be easily integrated into any website, regardless of the frontend technology stack being used.

## Key Features

- **Framework Agnostic**: Works with any website or application framework
- **Shadow DOM**: Uses shadow DOM for style isolation
- **Tailwind Integration**: Efficiently injects Tailwind styles into both document and shadow DOM
- **Simple API**: Configure the component with HTML attributes
- **Responsive Design**: Adapts to any device and screen size
- **Complete Functionality**: Includes all chat features, including message history

## How It Works

The fullscreen chat component is converted into a web component using the same approach as the widget:

1. The React component (`FullScreenChat`) is wrapped in a `FullScreenWebComponentWrapper` that handles converting attributes to props
2. The wrapper is converted to a base web component using `r2wc()`
3. A custom class extends this base component to inject styles into the shadow DOM
4. The custom element is registered with the browser using `customElements.define()`

## Building the Fullscreen Chat Web Component

The fullscreen chat component is built using a custom build script:

```bash
# Build the fullscreen chat web component
npm run build:fullscreen

# Or using yarn
yarn build:fullscreen
```

This script:
1. Processes all CSS with Tailwind and extracts it
2. Bundles the JavaScript code with esbuild
3. Injects the CSS into the bundle with code to handle both document and shadow DOM styling
4. Outputs the files to the `public/dist` directory

### Output Files

The build process generates the following files:

- `public/dist/mcp-fullscreen-chat.js`: The main bundled JavaScript file with injected CSS
- `public/dist/mcp-fullscreen-chat-styles.css`: A separate CSS file for reference
- `public/dist/mcp-fullscreen-chat.js.map`: Source map for debugging

## Embedding the Fullscreen Chat

The fullscreen chat component can be embedded on any website with just a few lines of HTML:

```html
<!-- Include the web component script -->
<script src="https://your-domain.com/dist/mcp-fullscreen-chat.js"></script>

<!-- Use the web component in your HTML -->
<mcp-fullscreen-chat 
  widget-id="123" 
  name="My Chat Assistant"
  description="A fullscreen chat interface for your application">
</mcp-fullscreen-chat>
```

### Configuration Options

The fullscreen chat component can be configured using HTML attributes:

| Attribute | Description | Default |
|-----------|-------------|---------|
| `widget-id` | ID of the widget to load from the server | Optional |
| `name` | Display name for the chat | "Chat Assistant" |
| `description` | Description shown in the header | Optional |
| `system-prompt` | System prompt for the AI model | Optional |
| `default-provider` | Default AI provider to use | "openai" |
| `mcp-servers` | JSON string of MCP servers configuration | Optional |

## Styling the Fullscreen Chat

The fullscreen chat component comes with built-in styling using Tailwind CSS. The styles are injected into the shadow DOM to prevent conflicts with the host page's styles.

To customize the appearance further, you can use CSS variables to override specific styles. Here's an example:

```html
<style>
  mcp-fullscreen-chat {
    --chat-primary-color: #0070f3;
    --chat-background-color: #ffffff;
    --chat-text-color: #333333;
    /* Add more custom variables as needed */
  }
</style>
```

## Differences from the Widget Chat

The fullscreen chat component differs from the widget chat in the following ways:

1. It's designed to be embedded directly in the page rather than as a floating widget
2. It doesn't include the minimize/maximize functionality of the widget
3. It's optimized for fullscreen or large container display areas
4. It doesn't include position controls since it's meant to be placed directly in the layout

## Example Usage Scenarios

- **Customer Support Page**: Embed the fullscreen chat on a dedicated support page
- **Knowledge Base**: Add a chat interface to a documentation or knowledge base page
- **Internal Tools**: Include the chat in internal dashboards or tools
- **AI Assistant Page**: Create a dedicated page for interacting with an AI assistant

## Troubleshooting

If you encounter styling issues:

1. Ensure the component script has loaded properly
2. Check that Tailwind styles are being injected correctly
3. Verify that your browser supports shadow DOM (all modern browsers do)
4. For older browsers, consider adding a polyfill for custom elements and shadow DOM 
# MCP Chat Widget Export

This document describes how the MCP Chat Widget is exported as a web component, making it easy to embed on any website.

## Overview

The MCP Chat Widget is built with React and exported as a native web component (custom element) using the `@r2wc/react-to-web-component` package. This approach allows the widget to be easily integrated into any website, regardless of the frontend technology stack being used.

## Key Features

- **Framework Agnostic**: Works with any website or application framework
- **Shadow DOM**: Uses shadow DOM for style isolation
- **Tailwind Integration**: Efficiently injects Tailwind styles into both document and shadow DOM
- **Simple API**: Configure the widget with HTML attributes
- **Responsive Design**: Adapts to any device and screen size
- **Complete Functionality**: Includes all chat features, including message history

## How React Components are Converted to Web Components

The project uses the `@r2wc/react-to-web-component` library to convert React components into web components. The process follows these steps:

1. The React component (`WidgetChat`) is wrapped in a `WebComponentWrapper` that handles converting attributes to props
2. The wrapper is converted to a base web component using `r2wc()`
3. A custom class extends this base component to inject styles into the shadow DOM
4. The custom element is registered with the browser using `customElements.define()`

This approach allows React components to be used as standard web components while maintaining all the benefits of React's component model.

## Tailwind CSS Integration

One of the most challenging aspects of web components is style integration, especially with utility-first CSS frameworks like Tailwind. This project solves the problem through a sophisticated approach:

1. During the build process, Tailwind CSS is processed with PostCSS
2. The resulting CSS is extracted and stored in both:
   - A separate CSS file for reference
   - Injected directly into the JavaScript bundle
3. When the component loads, it:
   - Injects styles into the document's head for normal rendering
   - Makes the styles available to the shadow DOM via a global variable
4. The custom element's `connectedCallback` injects these styles into its shadow root

This ensures that all Tailwind styles are available within the encapsulated shadow DOM environment, maintaining style isolation while providing full access to Tailwind's utility classes.

## Building the Web Component

The widget is built using a custom build script that leverages esbuild for fast and efficient bundling:

```bash
# Run the build script
npm run build:webcomponent

# Or using yarn
yarn build:webcomponent
```

This script:

1. Processes all CSS with Tailwind and extracts it
2. Bundles the JavaScript code with esbuild
3. Injects the CSS into the bundle with code to handle both document and shadow DOM styling
4. Outputs the files to the `public/dist` directory

### Output Files

The build process generates the following files:

- `public/dist/mcp-chat-widget.js`: The main bundled JavaScript file with injected CSS
- `public/dist/mcp-chat-widget-styles.css`: A separate CSS file for reference
- `public/dist/mcp-chat-widget.js.map`: Source map for debugging
- `public/dist/mcp-chat-widget.css.map`: CSS source map for debugging

## Embedding the Widget

The widget can be embedded on any website with just a few lines of HTML:

```html
<!-- Include the web component script -->
<script src="https://your-domain.com/dist/mcp-chat-widget.js"></script>

<!-- Use the web component in your HTML -->
<mcp-chat-widget 
  widget-id="123" 
  name="My Chat Widget"
  description="A customizable chat widget"
  position="bottom-right"
  size="md">
</mcp-chat-widget>
```

### Configuration Options

The widget can be configured using HTML attributes:

| Attribute | Description | Default |
|-----------|-------------|---------|
| `widget-id` | ID of the widget to load from the server | Optional |
| `name` | Display name for the chat widget | "Chat Assistant" |
| `description` | Description shown in the widget | Optional |
| `system-prompt` | System prompt for the AI model | Optional |
| `default-provider` | Default AI provider to use | "openai" |
| `position` | Widget position on screen | "bottom-right" |
| `size` | Widget size | "md" |
| `mcp-servers` | JSON string of MCP servers configuration | Optional |

## Serving the Widget

The widget is served from the `/dist` route on your domain. The files are statically served from the `public/dist` directory by the Next.js server.

For production, you can:

1. Deploy the application to a hosting provider
2. Configure your CDN to cache the widget files for optimal performance
3. Embed the widget on any website using the script tag

## Benefits of This Approach

- **Isolation**: The widget doesn't interfere with existing styles on the host page
- **Portability**: Can be used on any website, regardless of technology stack
- **Maintainability**: Changes to the widget can be deployed without requiring changes to host pages
- **Performance**: The widget is optimized for size and loading performance

## Advanced Usage

For advanced scenarios, you can interact with the widget programmatically:

```javascript
// Get a reference to the widget element
const widget = document.querySelector('mcp-chat-widget');

// Set attributes dynamically
widget.setAttribute('name', 'New Name');

// Listen for events
widget.addEventListener('message-sent', (event) => {
  console.log('Message sent:', event.detail);
});
```

## Troubleshooting

If you encounter styling issues:

1. Ensure the widget script has loaded properly
2. Check that Tailwind styles are being injected correctly
3. Verify that your browser supports shadow DOM (all modern browsers do)
4. For older browsers, consider adding a polyfill for custom elements and shadow DOM

## Future Improvements

Potential improvements for the widget export functionality:

1. Further optimization of the bundle size
2. Support for server-side rendering of the widget
3. Additional configuration options
4. Enhanced event system for integration with host applications
5. Theming support for easier customization 
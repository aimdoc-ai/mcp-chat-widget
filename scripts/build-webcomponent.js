const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

// Ensure the output directory exists
const outputDir = path.resolve(__dirname, '../public/dist');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Build the web component
esbuild.build({
  entryPoints: ['mcp-chat-widget.tsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020'],
  format: 'iife',
  outfile: 'public/dist/mcp-chat-widget.js',
  define: {
    'process.env.NODE_ENV': '"production"',
    'process': '{"env":{"NODE_ENV":"production"}}',
  },
  loader: {
    '.tsx': 'tsx',
    '.ts': 'tsx',
    '.js': 'jsx',
    '.jsx': 'jsx',
    '.css': 'css',
  },
  external: [],
  plugins: [],
}).then(() => {
  console.log('Web component built successfully!');
  console.log('Output file:', path.resolve(__dirname, '../public/dist/mcp-chat-widget.js'));
}).catch((error) => {
  console.error('Error building web component:', error);
  process.exit(1);
});

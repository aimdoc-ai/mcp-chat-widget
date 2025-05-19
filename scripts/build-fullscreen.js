const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

// Ensure the output directory exists
const outputDir = path.resolve(__dirname, '../public/dist');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Custom plugin to extract and process CSS with Tailwind
const tailwindPlugin = {
  name: 'tailwind-css',
  setup(build) {
    // Store collected CSS content
    let cssContent = '';

    // Handle CSS imports
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const css = await fs.promises.readFile(args.path, 'utf8');
      
      // Process CSS with PostCSS and Tailwind
      const result = await postcss([
        tailwindcss, 
        autoprefixer
      ]).process(css, { 
        from: args.path,
        to: path.join(outputDir, 'styles.css')
      });

      cssContent += result.css;
      
      // Return empty JS module since we'll inject CSS separately
      return {
        contents: `
          // CSS content handled by plugin
          export default {}
        `,
        loader: 'js',
      };
    });

    // Inject CSS at the end of the build
    build.onEnd(async () => {
      if (cssContent) {
        // Create a separate CSS file for reference
        await fs.promises.writeFile(
          path.join(outputDir, 'mcp-fullscreen-chat-styles.css'), 
          cssContent
        );
        
        // Get the bundled JS
        const jsPath = path.join(outputDir, 'mcp-fullscreen-chat.js');
        const jsContent = await fs.promises.readFile(jsPath, 'utf8');
        
        // Add code to inject Tailwind styles into document AND make them available for shadow DOM
        const cssInjectionCode = `
          // Inject Tailwind styles and make them available for shadow DOM
          (function() {
            // First, inject styles into the document for normal rendering
            const style = document.createElement('style');
            style.dataset.tailwind = 'true';
            style.textContent = ${JSON.stringify(cssContent)};
            document.head.appendChild(style);
            
            // Then make them available for use in shadow DOM
            if (typeof window !== 'undefined') {
              window.__tailwindFullscreenStyles = ${JSON.stringify(cssContent)};
            }
          })();
        `;
        
        // Write the JS with CSS injection code prepended
        await fs.promises.writeFile(
          jsPath,
          cssInjectionCode + jsContent
        );
      }
    });
  }
};

// Build the fullscreen web component
esbuild.build({
  entryPoints: ['mcp-fullscreen-chat.tsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020'],
  format: 'iife',
  outfile: 'public/dist/mcp-fullscreen-chat.js',
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
  plugins: [tailwindPlugin],
}).then(() => {
  console.log('Fullscreen chat web component built successfully!');
  console.log('Output file:', path.resolve(__dirname, '../public/dist/mcp-fullscreen-chat.js'));
  console.log('CSS file:', path.resolve(__dirname, '../public/dist/mcp-fullscreen-chat-styles.css'));
}).catch((error) => {
  console.error('Error building fullscreen chat web component:', error);
  process.exit(1);
}); 
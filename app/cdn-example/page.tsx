"use client";

import Link from 'next/link';
import { useEffect } from 'react';

export default function CDNExamplePage() {
  // Use useEffect to run the script loading logic only on the client side
  useEffect(() => {
    // Function to load script and create web component
    const loadScript = (src: string, container: HTMLElement, attributes?: Record<string, string>) => {
      return new Promise<void>((resolve, reject) => {
        // Check if script is already loaded
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          createWebComponent(container, attributes);
          resolve();
          return;
        }

        // Create and load the script
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        
        script.onload = () => {
          createWebComponent(container, attributes);
          resolve();
        };
        
        script.onerror = (error) => {
          console.error("Error loading script:", error);
          reject(error);
        };
        
        document.head.appendChild(script);
      });
    };
    
    // Function to create and append the web component
    const createWebComponent = (container: HTMLElement, attributes?: Record<string, string>) => {
      // Clear any existing content
      container.innerHTML = '';
      
      // Check if custom element is defined
      if (customElements.get('mcp-chat-widget')) {
        const widget = document.createElement('mcp-chat-widget');
        
        // Set attributes if provided
        if (attributes) {
          Object.entries(attributes).forEach(([key, value]) => {
            widget.setAttribute(key, value);
          });
        }
        
        container.appendChild(widget);
      } else {
        console.error("mcp-chat-widget custom element is not defined");
        container.innerHTML = '<div class="p-4 text-red-500">Error: Web component failed to load</div>';
      }
    };

    // Example 1: Generic Web Component
    const genericContainer = document.getElementById('generic-example-container');
    if (genericContainer) {
      loadScript('/api/webcomponent', genericContainer, {
        'widget-id': '2',
        'name': 'Generic Example',
        'description': 'Configured with attributes',
        'position': 'bottom-right',
        'size': 'md'
      }).catch(error => {
        console.error("Failed to load generic web component:", error);
        genericContainer.innerHTML = '<div class="p-4 text-red-500">Error: Failed to load web component</div>';
      });
    }
    
    // Example 2: Widget-Specific Web Component
    const specificContainer = document.getElementById('specific-example-container');
    if (specificContainer) {
      loadScript('/api/widgets/2/webcomponent', specificContainer)
        .catch(error => {
          console.error("Failed to load specific web component:", error);
          specificContainer.innerHTML = '<div class="p-4 text-red-500">Error: Failed to load web component</div>';
        });
    }
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">MCP Chat Widget CDN Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-2xl font-semibold mb-4">Generic Web Component</h2>
          <p className="mb-4">
            Load the web component script from the CDN endpoint and configure it with attributes:
          </p>
          
          <div className="bg-muted p-4 rounded-md mb-6 overflow-x-auto">
            <pre className="text-sm">
              <code>{`<!-- Include the web component script -->
<script src="/api/webcomponent"></script>

<!-- Use the web component in your HTML -->
<mcp-chat-widget 
  widget-id="1" 
  name="Generic Example"
  description="Configured with attributes"
  position="bottom-right"
  size="md">
</mcp-chat-widget>`}</code>
            </pre>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Live Example:</h3>
            <div className="border rounded-lg p-4 h-64 relative bg-background">
              {/* The web component will be loaded here client-side */}
              <div id="generic-example-container"></div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-2xl font-semibold mb-4">Widget-Specific Web Component</h2>
          <p className="mb-4">
            Load a pre-configured web component for a specific widget:
          </p>
          
          <div className="bg-muted p-4 rounded-md mb-6 overflow-x-auto">
            <pre className="text-sm">
              <code>{`<!-- Include the web component script with widget ID -->
<script src="/api/widgets/2/webcomponent"></script>

<!-- Use the web component in your HTML -->
<!-- No need to specify widget-id as it's pre-configured -->
<mcp-chat-widget></mcp-chat-widget>`}</code>
            </pre>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Live Example:</h3>
            <div className="border rounded-lg p-4 h-64 relative bg-background">
              {/* The web component will be loaded here client-side */}
              <div id="specific-example-container"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Link href="/" className="text-primary hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

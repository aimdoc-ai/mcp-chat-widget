// Import React and ReactDOM first
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMClient from 'react-dom/client';

// Import global styles for Tailwind
import './app/globals.css';

// Make React available globally
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;
(window as any).ReactDOMClient = ReactDOMClient;

// Store styles for injection into shadow DOM
const captureStyles = () => {
  // Queue this to run after styles are injected into document
  queueMicrotask(() => {
    // Store Tailwind and all other styles in the window object
    const allStyles = document.querySelectorAll('style');
    let combinedStyles = '';
    
    allStyles.forEach(styleTag => {
      combinedStyles += styleTag.textContent || '';
    });
    
    // Make styles available globally for shadow DOM injection
    (window as any).__tailwindFullscreenStyles = combinedStyles;
  });
};

// Execute style capture after all scripts have loaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', captureStyles);
  } else {
    captureStyles();
  }
}

// Then import our web component
import './components/mcp-fullscreen-webcomponent'; 
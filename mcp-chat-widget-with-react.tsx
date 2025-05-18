// Import React and ReactDOM first
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMClient from 'react-dom/client';

// Make them available globally
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;
(window as any).ReactDOMClient = ReactDOMClient;

// Then import our web component
import './components/mcp-chat-webcomponent';

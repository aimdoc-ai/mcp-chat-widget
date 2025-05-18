declare module 'react-to-webcomponent' {
  import React from 'react';
  import ReactDOM from 'react-dom';

  export default function reactToWebComponent(
    Component: React.ComponentType<any>,
    React: typeof React,
    ReactDOM: typeof ReactDOM,
    options?: {
      shadow?: boolean;
      props?: Record<string, any>;
    }
  ): CustomElementConstructor;
}

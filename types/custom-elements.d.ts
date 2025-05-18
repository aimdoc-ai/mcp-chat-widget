declare namespace JSX {
  interface IntrinsicElements {
    'mcp-chat-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      'widget-id'?: string;
      name?: string;
      description?: string;
      'system-prompt'?: string;
      'default-provider'?: string;
      position?: 'bottom-right' | 'bottom-left';
      size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
      'mcp-servers'?: string;
    }, HTMLElement>;
  }
}

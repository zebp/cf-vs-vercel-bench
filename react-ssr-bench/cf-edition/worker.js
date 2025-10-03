// React SSR CloudFlare Worker implementation
// Uses ReactDOMServer.renderToString to render React components to HTML

import React from 'react';
import { renderToString } from 'react-dom/server';
import ComplexComponent from './ComplexComponent.mjs';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/bench') {
      console.log("rendering", Date.now());

      const currentTime = new Date().toLocaleString();

      // Render the React component to HTML string
      const componentHtml = renderToString(
        React.createElement('main', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
          }
        },
          React.createElement('h1', {
            style: {
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '16px'
            }
          }, 'Last rendered at:'),
          React.createElement('p', {
            style: {
              fontSize: '18px',
              fontFamily: 'monospace',
              padding: '16px',
              borderRadius: '4px'
            }
          }, currentTime),
          React.createElement(ComplexComponent)
        )
      );

      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React SSR Benchmark - CloudFlare</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
          </style>
        </head>
        <body>
          ${componentHtml}
        </body>
        </html>
      `;

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};

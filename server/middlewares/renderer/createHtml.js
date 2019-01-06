import { normalizeCSS, criticalCSS } from '../../../utils/html/critical-css';
import createScriptTag from '../../../utils/html/createScriptTag';

const createHtmlHeader = ({
  head,
  css,
  scripts,
}) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=no, width=device-width">
      <meta name="theme-color" content="#305187">
      <style>
        html {
          font-family: system-ui, sans-serif;
        }
        body {
          margin: 0;
          padding: 0;
        }
      </style>
      <style>${normalizeCSS}</style>
      <style>${criticalCSS}</style>
      <style>${css}</style>
      ${head}
      ${scripts.map(createScriptTag).join()}
    </head>
  `
};

const createHtmlFooter = ({
  renderedComponent,
}) => {
  return `
    <body><div id="svelte-root">${renderedComponent}</div></body></html>
  `
}

export { createHtmlHeader, createHtmlFooter };

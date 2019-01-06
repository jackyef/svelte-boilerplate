import { Store } from 'svelte/store.umd';

import { createHtmlHeader, createHtmlFooter } from './createHtml';

import App from '../../../client/App.html';
import assets from '../../../build/client/assets.json';

console.log('renderer index reloaded');
console.log('renderer index reloaded');

const getUsedAssets = assets => {
  /**
   * Because we can't implement something like Loadable.Capture currently,
   * Let's just return the main bundle for now.
   * (it is named 'bundle', if we change the webpack config, we will need to change this as well)
   */
  return [assets['bundle.js']];
};

const rendererMiddleware = async (ctx, next) => {
  const initialData = {
    ssr: true,
    store: false,
  };
  const initialStore = new Store({
    ssr: true,
    store: true,
  });
  const { html, css, head } = App.render(initialData, initialStore);

  const usedAssets = getUsedAssets(assets);

  const responseHtml = `
    ${createHtmlHeader({ css: css.code, head, scripts: usedAssets })}
    ${createHtmlFooter({renderedComponent: html,
  })}`;

  ctx.set({
    'Content-Type': 'text/html',
    'Cache-Control': 'no-store',
  });
  ctx.body = responseHtml;

  await next();
};

export default rendererMiddleware;

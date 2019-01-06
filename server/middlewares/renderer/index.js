import { Store } from 'svelte/store';
import CombinedStream from 'combined-stream';

import { createHtmlHeader, createHtmlFooter } from './createHtml';

import App from '../../../client/App.html';

const prod = process.env.NODE_ENV === 'production';

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

  const responseStream = CombinedStream.create();
  responseStream.append(createHtmlHeader({ css: css.code, head }));
  responseStream.append(createHtmlFooter({ renderedComponent: html }));

  ctx.set({
    'Content-Type': 'text/html',
    'Cache-Control': 'no-store',
  });
  ctx.body = responseStream;

  await next();
};

export default rendererMiddleware;

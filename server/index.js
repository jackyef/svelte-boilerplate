import Koa from 'koa';
import koaCompress from 'koa-compress';

import renderer from './middlewares/renderer';

const app = new Koa();

app.use(koaCompress());

app.use(renderer);

export default app;

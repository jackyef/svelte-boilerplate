import { Store } from 'svelte/store';
import App from './App.html';

const store = new Store({
  name: 'world (from store)',
});

const app = new App({
  target: document.getElementById('svelte-root'),
  data: {
    name: 'world',
  },
  store,
});

window.app = app;
window.store = store;

export default app;

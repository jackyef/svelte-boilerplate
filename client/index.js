import { Store } from 'svelte/store';
import App from './App.html';

const store = new Store({
  name: 'world (from store)',
});

const target = document.getElementById('svelte-root');
// target.innerHTML = '';
const app = new App({
  target,
  data: {
    name: 'world',
  },
  store,
	hydrate: true,
});

window.app = app;
window.store = store;

export default app;

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { initializeStores } from './stores';
import('./assets/style/font.css');
import('./assets/style/common.css');

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

initializeStores().then(() => {
  app.mount('#app');
});

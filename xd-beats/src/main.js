import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useSpotifyStore } from './stores/spotify';
import('./assets/style/font.css');
import('./assets/style/common.css');

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const spotifyStore = useSpotifyStore();
spotifyStore.initialize().then(() => {
  app.mount('#app');
});

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useSpotifyStore } from './stores/spotify';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const spotifyStore = useSpotifyStore();
spotifyStore.initialize().then(() => {
  app.mount('#app');
});

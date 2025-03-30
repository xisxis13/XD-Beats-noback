import { createRouter, createWebHistory } from 'vue-router'
import PageLayout from '@/layouts/PageLayout.vue'
import HomePage from '../views/HomePage.vue'
import CallBack from '@/views/CallBack.vue';

const routes = [
  {
    path: "/",
    component: PageLayout,
    children: [
      { path: "/", name: 'Home', component: HomePage },
      { path: "/browse", name: 'Browse', component: HomePage },
      { path: "/library", name: 'Library', component: HomePage },
      { path: "/albums/:id", component: HomePage },
      { path: "/playlists/:id", component: HomePage },
      { path: "/profile", name: 'Profile', component: HomePage },
      { path: "/callback", name: 'Callback', component: CallBack },
    ]
  },
  { path: "/callback", name: 'Callback', component: CallBack }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router

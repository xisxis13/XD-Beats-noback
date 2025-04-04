import { createRouter, createWebHistory } from 'vue-router'
import PageLayout from '@/layouts/PageLayout.vue'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import AlbumOverview from '../views/AlbumOverview.vue'
import PlaylistOverview from '@/views/PlaylistOverview.vue'
import ProfileOverview from '@/views/ProfileOverview.vue'
import CallBack from '@/views/CallBack.vue';

const routes = [
  {
    path: "/",
    component: PageLayout,
    children: [
      { path: "/", name: 'Home', component: HomePage },
      { path: "/browse", name: 'Browse', component: HomePage },
      { path: "/library", name: 'Library', component: HomePage },
      { path: "/albums/:albumId", component: AlbumOverview },
      { path: "/playlists/:playlistId", component: PlaylistOverview },
      { path: "/profile", name: 'Profile', component: ProfileOverview },
      { path: "/callback", name: 'Callback', component: CallBack },
    ]
  },
  { path: "/callback", name: 'Callback', component: CallBack },
  { path: "/login", name: 'Login', component: LoginPage },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router

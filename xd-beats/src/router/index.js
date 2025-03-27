import { createRouter, createWebHistory } from 'vue-router'
import PageLayout from '@/layouts/PageLayout.vue'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: "/",
    component: PageLayout,
    children: [
      { path: "", component: HomePage },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router

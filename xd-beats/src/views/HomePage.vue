<script setup>
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const profileStore = useProfileStore();

const welcomeMessage = () => {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 18) {
    return "Good afternoon";
  } else if (hour >= 18 && hour < 22) {
    return "Good evening";
  } else {
    return "Good night";
  }
};
</script>

<template>
  <div class="home-page-main-container box">
    <template v-if="profileStore.userProfile">
      <h2>{{ welcomeMessage() }}, <span class="home-page-user-name">{{ profileStore.userProfile.display_name }}</span> !</h2>
    </template>

    <template v-if="!authStore.accessToken">
      <h2>It seems like you're not connected</h2>
      <RouterLink :to="'/login'" class="go-to-login-page-btn"><h3>Go to login page</h3></RouterLink>
    </template>
  </div>
</template>

<style scoped>
.home-page-main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.home-page-user-name {
  color: var(--orange);
}

.go-to-login-page-btn h3 {
  text-decoration: underline;
}
</style>

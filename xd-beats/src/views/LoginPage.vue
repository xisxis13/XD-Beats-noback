<script setup>
import spotifyIcon from '@/assets/icons/spotify-icon.svg';
import appIcon from '@/assets/icons/app-logo.svg';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="login-page-container">
    <h2 class="welcome-msg">Welcome to XD Beats, a Spotify account controller</h2>

    <div class="login-form-container box">
      <img :src="appIcon" alt="app icon">

      <hr>

      <h3>Connect you with your Spotify account</h3>

      <button class="login-btn" @click="authStore.login">
        <img :src="spotifyIcon" alt="spotify icon">
        <h4>Log in with Spotify</h4>
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;

  width: 100vw;
  height: 100vh;

  background-color: var(--background);
}

.welcome-msg {
  width: 30%;
  min-width: 300px;
  max-width: 380px;

  text-align: center;
}

.login-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;

  padding: 24px;
  width: 280px;
}

.login-form-container hr {
  width: 100%;
  border-color: var(--light-content);
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 12px;

  padding: 8px 12px;
  width: 100%;

  border-radius: 15px;
  border: solid 2px var(--light-content);
  background-color: var(--box);

  cursor: pointer;
}
</style>

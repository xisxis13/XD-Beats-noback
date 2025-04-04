<script setup>
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const profileStore = useProfileStore();
const router = useRouter();

onMounted(async () => {
  const code = new URLSearchParams(window.location.search).get('code');
  if (code) {
    try {
      await authStore.getToken(code);
      await profileStore.fetchUserProfile();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de l\'authentification:', error);
      router.push('/login');
    }
  }
});
</script>

<template>
  <div class="callback-container">
    <h2>Connexion en cours...</h2>
    <p>Veuillez patienter pendant que nous établissons la connexion...</p>
  </div>
</template>

<style scoped>
.callback-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 100%;
  width: 100%;
}
</style>

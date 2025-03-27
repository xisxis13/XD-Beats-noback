<script setup>
import { useSpotifyStore } from '@/stores/spotify';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const spotifyStore = useSpotifyStore();
const router = useRouter();

onMounted(async () => {
  const code = new URLSearchParams(window.location.search).get('code');
  if (code) {
    await spotifyStore.getToken(code);
    await spotifyStore.fetchUserProfile();
    router.push('/');
  }
});
</script>

<template>
  <h2>Connexion en cours...</h2>
</template>

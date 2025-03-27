<script setup>
import { useSpotifyStore } from '@/stores/spotify';

const spotifyStore = useSpotifyStore();
</script>

<template>
  <div>
    <h1>Bienvenue, {{ spotifyStore.userProfile?.display_name }}</h1>
    <button v-if="!spotifyStore.accessToken" @click="spotifyStore.login">Se connecter à Spotify</button>
  </div>
</template>

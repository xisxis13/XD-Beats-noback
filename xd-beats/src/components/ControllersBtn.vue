<script setup>
import { CirclePlay, CirclePause, Shuffle, Repeat, FastForward, Rewind, Mic } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { usePlayerStore } from '@/stores/player';
import { ref, onMounted } from 'vue';

const props = defineProps({
  currentSong: {
    type: Object,
    required: true,
  },
});

const authStore = useAuthStore();
const playerStore = usePlayerStore();
const isRepeat = ref(null);
const isPlaying = ref(null);

const toggleRepeat = async () => {
  try {
    await playerStore.toggleRepeat();
    isRepeat.value = playerStore.isRepeat;
  } catch (error) {
    console.error('Erreur lors du chargement du mode boucle:', error);
  }
};

const previousTrack = async () => {
  try {
    await playerStore.previousTrack();
  } catch (error) {
    console.error('Erreur lors du passage au titre précédent:', error);
  }
};

const nextTrack = async () => {
  try {
    await playerStore.nextTrack();
  } catch (error) {
    console.error('Erreur lors du passage au titre suivant:', error);
  }
};

const togglePlayPause = async () => {
  try {
    await playerStore.togglePlayPause();
    isPlaying.value = playerStore.isPlaying;
  } catch (error) {
    console.error('Erreur lors du changement play/pause:', error);
  }
};

const toggleShuffle = async () => {
  try {
    await playerStore.toggleShuffle();
  } catch (error) {
    console.error('Erreur lors du changement du mode aléatoire:', error);
  }
};

onMounted(async () => {
  if (authStore.accessToken) {
    await toggleRepeat();
    await togglePlayPause();
  }
});
</script>

<template>
  <div class="controllers-container">
    <Repeat id="repeat-btn" class="controller-btn" @click="toggleRepeat" />
    <Rewind id="previous-song-btn" class="controller-btn" @click="previousTrack" />
    <CirclePause v-if="currentSong.is_playing" id="pause-btn" class="controller-btn" @click="togglePlayPause" />
    <CirclePlay v-else id="play-btn" class="controller-btn" @click="togglePlayPause" />
    <FastForward id="next-song-btn" class="controller-btn" @click="nextTrack" />
    <Shuffle id="shuffle-btn" class="controller-btn" @click="toggleShuffle" />
    <Mic id="lyrics-btn" class="controller-btn" />
  </div>
</template>

<style scoped>
.controllers-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;

  width: 100%;
}

.controller-btn {
  height: 22px;

  color: var(--text);

  cursor: pointer;
}
</style>

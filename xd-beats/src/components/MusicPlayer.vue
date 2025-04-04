<script setup>
import explicitIcon from '@/assets/icons/explicit-icon.svg';
import ProgressBar from '@/components/ProgressBar.vue';
import ControllersBtn from './ControllersBtn.vue';
import { useAuthStore } from '@/stores/auth';
import { usePlayerStore } from '@/stores/player';
import { RouterLink } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const authStore = useAuthStore();
const playerStore = usePlayerStore();
const currentlyPlaying = ref(null);
const progressMs = ref(0);
const durationMs = ref(0);
const isPlaying = ref(false);
let intervalId = null;

const fetchCurrentlyPlaying = async () => {
  try {
    await playerStore.fetchCurrentlyPlaying();
    currentlyPlaying.value = playerStore.currentlyPlaying;
    if (currentlyPlaying.value) {
      progressMs.value = currentlyPlaying.value.progress_ms;
      durationMs.value = currentlyPlaying.value.item.duration_ms;
      isPlaying.value = currentlyPlaying.value.is_playing;
      startProgressUpdate();
    } else {
      stopProgressUpdate();
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la lecture actuelle:', error);
  }
};

const startProgressUpdate = () => {
  if (isPlaying.value && !intervalId) {
    intervalId = setInterval(() => {
      if (isPlaying.value) {
        progressMs.value += 1000;
        if (progressMs.value >= durationMs.value) {
          fetchCurrentlyPlaying();
        }
      }
    }, 1000);
  }
};

const stopProgressUpdate = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const handleSeek = async (newPosition) => {
  try {
    await playerStore.seekToPosition(newPosition);
    progressMs.value = newPosition;
    fetchCurrentlyPlaying();
  } catch (error) {
    console.error('Erreur lors du seek:', error);
  }
};

onMounted(() => {
  if (authStore.accessToken) {
    fetchCurrentlyPlaying();
  }
});

onBeforeUnmount(() => {
  stopProgressUpdate();
});
</script>

<template>
  <div class="player-container box">
    <template v-if="currentlyPlaying">
      <div class="current-song-container">
        <img
          class="current-song-cover"
          :src="currentlyPlaying.item.album.images[0].url"
          :alt="currentlyPlaying.item.album.name + ' cover'"
        >

        <div class="current-song-details">
          <RouterLink class="current-song-name-link" :to="`/albums/${currentlyPlaying.item.album.id}`">
            <h4 class="current-song-name">{{ currentlyPlaying.item.name }}</h4>
          </RouterLink>

          <div class="current-song-artist-container">
            <img
              v-if="currentlyPlaying.item.explicit"
              class="explicit-icon"
              :src="explicitIcon"
              alt="explicit icon"
            >
            <template v-for="(artist, index) in currentlyPlaying.item.artists" :key="artist.id">
              <RouterLink class="current-song-artist-link" :to="`/artists/${artist.id}`">
                <h6 class="current-song-artist-name light">{{ artist.name }}</h6>
                <span class="light" v-if="index < currentlyPlaying.item.artists.length - 1">, </span>
              </RouterLink>
            </template>
          </div>
        </div>
      </div>

      <div class="controller-container">
        <ControllersBtn :current-song="currentlyPlaying" />
        <ProgressBar :progress="progressMs" :duration="durationMs" @seek="handleSeek"/>
      </div>

      <div class="actions-btn-container">

      </div>
    </template>
  </div>
</template>

<style scoped>
.player-container {
  grid-area: player;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  column-gap: 32px;
  padding: 12px 24px 12px 12px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.current-song-container {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 16px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.current-song-cover {
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 12px;
}

.current-song-details {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.current-song-name,
.current-song-artist-name {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.current-song-artist-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  width: 100%;
  overflow: hidden;
}

.current-song-artist-link,
.current-song-name-link {
  display: flex;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
  text-decoration: none;
}

.current-song-name:hover,
.current-song-artist-name:hover {
  text-decoration: underline;
}

.controller-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  width: 100%;
}

.actions-btn-container {
  width: 100%;
}
</style>

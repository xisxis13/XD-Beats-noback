<script>
import explicitIcon from '@/assets/icons/explicit-icon.svg';
import ProgressBar from '@/components/ProgressBar.vue';
import ControllersBtn from './ControllersBtn.vue';
import { useSpotifyStore } from '@/stores/spotify';
import { RouterLink } from 'vue-router';

export default {
  components: {
    RouterLink,
    ProgressBar,
    ControllersBtn,
  },
  data() {
    return {
      store: useSpotifyStore(),
      currentlyPlaying: null,
      explicitIcon,
      progressMs: 0,
      durationMs: 0,
      isPlaying: false,
      intervalId: null,
    };
  },
  methods: {
    async fetchCurrentlyPlaying() {
      try {
        await this.store.fetchCurrentlyPlaying();
        this.currentlyPlaying = this.store.currentlyPlaying;
        if (this.currentlyPlaying) {
          this.progressMs = this.currentlyPlaying.progress_ms;
          this.durationMs = this.currentlyPlaying.item.duration_ms;
          this.isPlaying = this.currentlyPlaying.is_playing;
          this.startProgressUpdate();
        } else {
          this.stopProgressUpdate();
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la lecture actuelle:', error);
      }
    },

    startProgressUpdate() {
      if (this.isPlaying && !this.intervalId) {
        this.intervalId = setInterval(() => {
          if (this.isPlaying) {
            this.progressMs += 1000;
            if (this.progressMs >= this.durationMs) {
              this.fetchCurrentlyPlaying();
            }
          }
        }, 1000);
      }
    },

    stopProgressUpdate() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },

    async handleSeek(newPosition) {
      try {
        await this.store.seekToPosition(newPosition);
        this.progressMs = newPosition;
        this.fetchCurrentlyPlaying();
      } catch (error) {
        console.error('Erreur lors du seek:', error);
      }
    },
  },
  mounted() {
    if (this.store.accessToken) {
      this.fetchCurrentlyPlaying();
    }
  },
  beforeUnmount() {
    this.stopProgressUpdate();
  },
};
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

<style>
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

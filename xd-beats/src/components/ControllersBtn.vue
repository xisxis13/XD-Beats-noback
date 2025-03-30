<script>
import { CirclePlay, CirclePause, Shuffle, Repeat, FastForward, Rewind, Mic } from 'lucide-vue-next';
import { useSpotifyStore } from '@/stores/spotify';

export default {
  components: {
    CirclePlay,
    CirclePause,
    Shuffle,
    Repeat,
    FastForward,
    Rewind,
    Mic,
  },
  props: {
    currentSong: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      store: useSpotifyStore(),
      isRepeat: null,
      isPlaying: null,
    };
  },
  methods: {
    async toggleRepeat() {
      try {
        await this.store.toggleRepeat();
        this.isRepeat = this.store.isRepeat;
      } catch (error) {
        console.error('Erreur lors du chargement du mode boucle:', error);
      }
    },
    async previousTrack() {
      try {
        await this.store.previousTrack();
      } catch (error) {
        console.error('Erreur lors du passage au titre précédent:', error);
      }
    },
    async nextTrack() {
      try {
        await this.store.nextTrack();
      } catch (error) {
        console.error('Erreur lors du passage au titre suivant:', error);
      }
    },
    async togglePlayPause() {
      try {
        await this.store.togglePlayPause();
        this.isPlaying = this.store.isPlaying;
      } catch (error) {
        console.error('Erreur lors du changement play/pause:', error);
      }
    },
    async toggleShuffle() {
      try {
        await this.store.toggleShuffle();
      } catch (error) {
        console.error('Erreur lors du changement du mode aléatoire:', error);
      }
    },
    async mounted() {
      if (this.store.accessToken) {
        await this.toggleRepeat();
        await this.togglePlayPause();
      }
    },
  },
};
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

<style>
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

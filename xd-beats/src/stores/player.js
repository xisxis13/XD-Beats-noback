import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { spotifyApi } from '@/assets/services/spotifyApi';

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentPlaylist: null,
    playbackProgress: 0,
    playbackDuration: 0,
    isPlaying: false,
    isRepeat: false,
    isShuffle: false,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCurrentlyPlaying() {
      const authStore = useAuthStore();
      if (!authStore.accessToken) return null;

      this.loading = true;
      this.error = null;

      try {
        const response = await spotifyApi.getCurrentlyPlaying(authStore.accessToken);

        if (response.status === 200 && response.data) {
          this.currentlyPlaying = response.data;
          this.isPlaying = response.data.is_playing;
          this.playbackProgress = response.data.progress_ms;
          this.playbackDuration = response.data.item.duration_ms;
        } else {
          this.currentlyPlaying = null;
          this.isPlaying = false;
        }

        return this.currentlyPlaying;
      } catch (error) {
        this.error = error.message || 'Erreur lors du chargement de la lecture';
        this.currentlyPlaying = null;
        this.isPlaying = false;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async seekToPosition(positionMs) {
      const authStore = useAuthStore();
      if(!authStore.accessToken) throw new Error('No accessToken enabled');

      try {
        await spotifyApi.seekToPosition(authStore.accessToken, positionMs);
        this.playbackProgress = positionMs;
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.seekToPosition(positionMs);
        }
        throw error;
      }
    },

    async toggleRepeat() {
      const authStore = useAuthStore();
      if (!authStore.accessToken) throw new Error('Aucun accessToken disponible');

      try {
        const state = this.isRepeat ? 'off' : 'track';
        await spotifyApi.setRepeat(authStore.accessToken, state);
        this.isRepeat = !this.isRepeat;
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.toggleRepeat();
        }
        throw error;
      }
    },

    async previousTrack() {
      const authStore = useAuthStore();
      if (!authStore.accessToken) throw new Error('Aucun accessToken disponible');

      try {
        await spotifyApi.previousTrack(authStore.accessToken);
        setTimeout(() => this.fetchCurrentlyPlaying(), 500);
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.previousTrack();
        }
        throw error;
      }
    },

    async nextTrack() {
      const authStore = useAuthStore();
      if (!authStore.accessToken) throw new Error('Aucun accessToken disponible');

      try {
        await spotifyApi.nextTrack(authStore.accessToken);
        setTimeout(() => this.fetchCurrentlyPlaying(), 500);
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.nextTrack();
        }
        throw error;
      }
    },

    async togglePlayPause() {
      const authStore = useAuthStore();
      if (!authStore.accessToken) throw new Error('Aucun accessToken disponible');

      try {
        await spotifyApi.togglePlayback(authStore.accessToken, !this.isPlaying);
        this.isPlaying = !this.isPlaying;
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.togglePlayPause();
        }
        throw error;
      }
    },

    async toggleShuffle() {
      const authStore = useAuthStore();
      if (!authStore.accessToken) throw new Error('Aucun accessToken disponible');

      try {
        const state = !this.isShuffle;
        await spotifyApi.setShuffle(authStore.accessToken, state);
        this.isShuffle = state;
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.toggleShuffle();
        }
        throw error;
      }
    },
  },

  getters: {
    currentTrackName: (state) => state.currentlyPlaying?.item?.name,
    currentTrackArtists: (state) => state.currentlyPlaying?.item?.artists,
    currentTrackAlbum: (state) => state.currentlyPlaying?.item?.album,
    progressPercentage: (state) => {
      if (!state.playbackDuration) return 0;
      return (state.playbackProgress / state.playbackDuration) * 100;
    },
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error
  }
});

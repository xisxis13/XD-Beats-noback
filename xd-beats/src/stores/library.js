import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { spotifyApi } from '@/assets/services/spotifyApi';

export const useLibraryStore = defineStore('library', {
  state: () => ({
    savedAlbums: [],
    savedPlaylists: [],
    albumSelected: null,
    playlistSelected: null,
    followedArtists: [],
    publicPlaylists: [],
    loading: {
      albums: false,
      playlists: false,
      artists: false,
      albumDetails: false,
      playlistDetails: false
    },
    error: null
  }),

  actions: {
    async fetchUserSavedAlbums(limit = 8, offset = 0) {
      const authStore = useAuthStore();
      if (!authStore.accessToken) throw new Error('Aucun accessToken disponible');

      this.loading.albums = true;
      this.error = null;

      try {
        const response = await spotifyApi.getUserAlbums(authStore.accessToken, limit, offset);
        this.savedAlbums = response.data.items;
        return this.savedAlbums;
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.fetchUserSavedAlbums(limit, offset);
        } else if (error.response?.status === 403) {
          this.error = 'Autorisation manquante: scope "user-library-read" requis';
        } else {
          this.error = error.message || 'Erreur lors du chargement des albums';
        }
        throw error;
      } finally {
        this.loading.albums = false;
      }
    },

    async fetchUserSavedPlaylists(limit = 8, offset = 0) {
      const authStore = useAuthStore();
      if (!authStore.accessToken) throw new Error('Aucun accessToken disponible');

      this.loading.playlists = true;
      this.error = null;

      try {
        const response = await spotifyApi.getUserPlaylists(authStore.accessToken, limit, offset);
        this.savedPlaylists = response.data.items;
        return this.savedPlaylists;
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.fetchUserSavedPlaylists(limit, offset);
        } else {
          this.error = error.message || 'Erreur lors du chargement des playlists';
        }
        throw error;
      } finally {
        this.loading.playlists = false;
      }
    },

    async fetchAlbumById(albumId) {
      const authStore = useAuthStore();
      if (!authStore.accessToken) throw new Error('Aucun accessToken disponible');

      this.loading.albumDetails = true;
      this.error = null;

      try {
        const response = await spotifyApi.getAlbumById(authStore.accessToken, albumId);
        this.albumSelected = response.data;
        return this.albumSelected;
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.fetchAlbumById(albumId);
        } else {
          this.error = error.message || 'Erreur lors du chargement de l\'album';
        }
        throw error;
      } finally {
        this.loading.albumDetails = false;
      }
    },

    async fetchPlaylistById(playlistId) {
      const authStore = useAuthStore();
      if (!authStore.accessToken) throw new Error('Aucun accessToken disponible');

      this.loading.playlistDetails = true;
      this.error = null;

      try {
        const response = await spotifyApi.getPlaylistById(authStore.accessToken, playlistId);
        this.playlistSelected = response.data;
        return this.playlistSelected;
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.fetchPlaylistById(playlistId);
        } else {
          this.error = error.message || 'Erreur lors du chargement de la playlist';
        }
        throw error;
      } finally {
        this.loading.playlistDetails = false;
      }
    },

    async fetchUserFollowedArtists(limit = 50) {
      const authStore = useAuthStore();
      if (!authStore.accessToken) throw new Error('Aucun accessToken disponible');

      this.loading.artists = true;
      this.error = null;

      try {
        const response = await spotifyApi.getFollowedArtists(authStore.accessToken, limit);
        this.followedArtists = response.data.artists.items;
        return this.followedArtists;
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.fetchUserFollowedArtists(limit);
        } else if (error.response?.status === 403) {
          this.error = 'Autorisation manquante: scope "user-follow-read" requis';
        } else {
          this.error = error.message || 'Erreur lors du chargement des artistes suivis';
        }
        throw error;
      } finally {
        this.loading.artists = false;
      }
    },

    async fetchUserPublicPlaylists(limit = 50, offset = 5) {
      const authStore = useAuthStore();
      if (!authStore.accessToken) throw new Error('Aucun accessToken disponible');

      this.loading.playlists = true;
      this.error = null;

      try {
        const response = await spotifyApi.getUserPlaylists(authStore.accessToken, limit, offset);
        this.publicPlaylists = response.data.items;
        return this.publicPlaylists;
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.fetchUserPublicPlaylists(limit, offset);
        } else if (error.response?.status === 403) {
          this.error = 'Autorisation manquante: scope "playlist-read-private" requis';
        } else {
          this.error = error.message || 'Erreur lors du chargement des playlists publiques';
        }
        throw error;
      } finally {
        this.loading.playlists = false;
      }
    }
  },

  getters: {
    allLibraryItems: (state) => [...state.savedAlbums, ...state.savedPlaylists],
    isLoadingAny: (state) => Object.values(state.loading).some(val => val === true),
    albumName: (state) => state.albumSelected?.name,
    playlistName: (state) => state.playlistSelected?.name,
    hasError: (state) => !!state.error
  }
});

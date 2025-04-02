import { defineStore } from 'pinia';
import axios from 'axios';

function generateRandomString(length) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(36)).join('').slice(0, length);
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const useSpotifyStore = defineStore('spotify', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    userProfile: null,
    codeVerifier: null,
    savedAlbums: [],
    savedPlaylists: [],
    currentlyPlaying: null,
    playbackProgress: 0,
    playbackDuration: 0,
    isPlaying: null,
    isRepeat: null,
    isShuffle: false,
    albumSelected: null,
    playlistSelected: null,
  }),
  actions: {
    async login() {
      const clientId = '656fafd0a60d45bdb5757933f4ac7f18';
      const redirectUri = 'http://localhost:5173/callback';
      const scopes = 'user-read-private user-read-email playlist-read-private user-library-read user-read-currently-playing user-read-playback-state user-modify-playback-state';

      this.codeVerifier = generateRandomString(128);
      localStorage.setItem('codeVerifier', this.codeVerifier);
      const codeChallenge = await generateCodeChallenge(this.codeVerifier);

      const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
      window.location = authUrl;
    },

    async getToken(code) {
      try {
        const clientId = '656fafd0a60d45bdb5757933f4ac7f18';
        const redirectUri = 'http://localhost:5173/callback';
        const tokenUrl = 'https://accounts.spotify.com/api/token';
        const codeVerifier = localStorage.getItem('codeVerifier');

        if (!codeVerifier) {
          throw new Error('codeVerifier manquant dans localStorage');
        }

        const response = await axios.post(
          tokenUrl,
          new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            code_verifier: codeVerifier,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        this.accessToken = response.data.access_token;
        this.refreshToken = response.data.refresh_token;
        localStorage.setItem('accessToken', this.accessToken);
        localStorage.setItem('refreshToken', this.refreshToken);
        localStorage.removeItem('codeVerifier');
      } catch (error) {
        console.error('Erreur lors de la récupération du token:', error.response?.data || error.message);
        throw error;
      }
    },

    async fetchUserProfile() {
      try {
        if (!this.accessToken) {
          throw new Error('Aucun accessToken disponible');
        }
        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
        this.userProfile = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          await this.fetchUserProfile();
        }
      }
    },

    async fetchUserSavedAlbums(limit = 20, offset = 0) {
      try {
        if (!this.accessToken) {
          throw new Error('Aucun accessToken disponible');
        }

        const response = await axios.get('https://api.spotify.com/v1/me/albums', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            limit,
            offset,
          },
        });

        this.savedAlbums = response.data.items;
      } catch (error) {
        console.error('Erreur lors de la récupération des albums sauvergardés:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          return this.fetchUserSavedAlbums(limit, offset);
        } else if (error.response?.status === 403) {
          console.error('Erreur d\'autorisation: vérifiez que le scope "user-library-read" est bien inclus');
          this.logout();
          await this.login();
        }
        throw error;
      }
    },

    async fetchUserSavedPlaylists(limit = 20, offset = 0) {
      try {
        if (!this.accessToken) {
          throw new Error('Aucun accessToken disponible');
        }

        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            limit,
            offset,
          },
        });

        this.savedPlaylists = response.data.items;
      } catch (error) {
        console.error('Erreur lors de la récupération des playlists sauvergardés:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          await this.fetchUserSavedPlaylists(limit, offset);
        }
        throw error;
      }
    },

    async fetchCurrentlyPlaying() {
      try {
        if (!this.accessToken) {
          throw new Error('Aucun accessToken disponible');
        }
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
        if (response.status === 200 && response.data) {
          this.currentlyPlaying = response.data;
          this.isPlaying = response.data.is_playing;
          this.playbackProgress = response.data.progress_ms;
          this.playbackDuration = response.data.item.duration_ms;
        } else {
          this.currentlyPlaying = null;
          this.isPlaying = false;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la lecture actuelle:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          await this.fetchCurrentlyPlaying();
        } else {
          this.currentlyPlaying = null;
          this.isPlaying = false;
        }
      }
    },

    async seekToPosition(positionMs) {
      try {
        if (!this.accessToken) {
          throw new Error('Aucun accessToken disponible');
        }
        await axios.put(
          'https://api.spotify.com/v1/me/player/seek',
          null,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
            params: {
              position_ms: positionMs,
            },
          }
        );
        this.playbackProgress = positionMs;
      } catch (error) {
        console.error('Erreur lors du changement de position:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          return this.seekToPosition(positionMs);
        }
      }
    },

    async toggleRepeat() {
      try {
        if (!this.accessToken) throw new Error('Aucun accessToken disponible');
        const state = this.isRepeat ? 'off' : 'track';
        await axios.put(
          'https://api.spotify.com/v1/me/player/repeat',
          null,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
            params: { state },
          }
        );
        this.isRepeat = !this.isRepeat;
      } catch (error) {
        console.error('Erreur lors du changement du mode boucle:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          await this.toggleRepeat();
        }
      }
    },

    async previousTrack() {
      try {
        if (!this.accessToken) throw new Error('Aucun accessToken disponible');
        await axios.post(
          'https://api.spotify.com/v1/me/player/previous',
          null,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
          }
        );
        setTimeout(() => this.fetchCurrentlyPlaying(), 500);
      } catch (error) {
        console.error('Erreur lors du passage au titre précédent:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          await this.previousTrack();
        }
      }
    },

    async nextTrack() {
      try {
        if (!this.accessToken) throw new Error('Aucun accessToken disponible');
        await axios.post(
          'https://api.spotify.com/v1/me/player/next',
          null,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
          }
        );
        setTimeout(() => this.fetchCurrentlyPlaying(), 500);
      } catch (error) {
        console.error('Erreur lors du passage au titre suivant:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          await this.nextTrack();
        }
      }
    },

    async togglePlayPause() {
      try {
        if (!this.accessToken) throw new Error('Aucun accessToken disponible');
        const method = this.isPlaying ? 'pause' : 'play';
        await axios.put(
          `https://api.spotify.com/v1/me/player/${method}`,
          null,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
          }
        );
        this.isPlaying = !this.isPlaying;
      } catch (error) {
        console.error('Erreur lors du changement play/pause:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          await this.togglePlayPause();
        }
      }
    },

    async toggleShuffle() {
      try {
        if (!this.accessToken) throw new Error('Aucun accessToken disponible');
        const state = !this.isShuffle;
        await axios.put(
          'https://api.spotify.com/v1/me/player/shuffle',
          null,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
            params: { state },
          }
        );
        this.isShuffle = state;
      } catch (error) {
        console.error('Erreur lors du changement du mode aléatoire:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          await this.toggleShuffle();
        }
      }
    },

    async fetchAlbumById(albumId) {
      try {
        if (!this.accessToken) {
          throw new Error('Aucun accessToken disponible');
        }
        const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
        this.albumSelected = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération de l album:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          await this.fetchAlbumById(albumId);
        }
      }
    },

    async fetchPlaylistById(playlistId) {
      try {
        if (!this.accessToken) {
          throw new Error('Aucun accessToken disponible');
        }
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
        this.playlistSelected = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération de la playlist:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          await this.fetchPlaylistById(playlistId);
        }
      }
    },

    async refreshAccessToken() {
      try {
        const clientId = '656fafd0a60d45bdb5757933f4ac7f18';
        const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken,
            client_id: clientId,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        this.accessToken = response.data.access_token;
        localStorage.setItem('accessToken', this.accessToken);
      } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error.response?.data || error.message);
        this.logout();
      }
    },

    async initialize() {
      if (this.accessToken && !this.userProfile) {
        await this.fetchUserProfile();
      } else if (!this.accessToken && this.refreshToken) {
        await this.refreshAccessToken();
        await this.fetchUserProfile();
      }
    },

    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.userProfile = null;
      this.savedAlbums = [];
      this.savedPlaylists = [];
      this.currentlyPlaying = null;
      this.playbackDuration = 0;
      this.playbackProgress = 0;
      this.isPlaying = null;
      this.isRepeat = null;
      this.isShuffle = false;
      this.albumSelected = null;
      this.playlistSelected = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});

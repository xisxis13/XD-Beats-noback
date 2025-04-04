import { useAuthStore } from "@/stores/auth";
import axios from "axios";

export const spotifyApi = {
  createHeaders(accesstoken) {
    return {
      Authorization: `Bearer ${accesstoken}`
    };
  },

  async get(endpoint, accessToken, params = {}) {
    try {
      return await axios.get(`https://api.spotify.com/v1${endpoint}`, {
        headers: this.createHeaders(accessToken),
        params,
      });
    } catch (error) {
      return this.handleApiError(error);
    }
  },

  async post(endpoint, accessToken, data = null, params = {}) {
    try {
      return await axios.post(`https://api.spotify.com/v1${endpoint}`, data, {
        headers: this.createHeaders(accessToken),
        params
      });
    } catch (error) {
      return this.handleApiError(error);
    }
  },

  async put(endpoint, accessToken, data = null, params = {}) {
    try {
      return await axios.put(`https://api.spotify.com/v1${endpoint}`, data, {
        headers: this.createHeaders(accessToken),
        params
      });
    } catch (error) {
      return this.handleApiError(error);
    }
  },

  async handleApiError(error) {
    if (axios.isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 401) {
        const authStore = useAuthStore();
        await authStore.refreshAccessToken();
      } else if (response?.status === 403) {
        console.error('Forbidden: You lack the necessary permissions', response.data);
      } else if (response?.status === 429) {
        console.error('Rate limit exceeded: Too many requests');
      }
    }

    throw error;
  },

  getUserProfile(accessToken) {
    return this.get('/me', accessToken);
  },

  getCurrentlyPlaying(accessToken) {
    return this.get('/me/player/currently-playing', accessToken);
  },

  getUserAlbums(accessToken, limit = 8, offset = 0) {
    return this.get('/me/albums', accessToken, { limit, offset });
  },

  getUserPlaylists(accessToken, limit = 50, offset = 0) {
    return this.get('/me/playlists', accessToken, { limit, offset });
  },

  getAlbumById(accessToken, albumId) {
    return this.get(`/albums/${albumId}`, accessToken);
  },

  getPlaylistById(accessToken, playlistId) {
    return this.get(`/playlists/${playlistId}`, accessToken);
  },

  getFollowedArtists(accessToken, limit = 50) {
    return this.get('/me/following', accessToken, { type: 'artist', limit });
  },

  seekToPosition(accessToken, positionMs) {
    return this.put('/me/player/seek', accessToken, null, { position_ms: positionMs });
  },

  togglePlayback(accessToken, play) {
    const endpoint = play ? '/me/player/play' : '/me/player/pause';
    return this.put(endpoint, accessToken);
  },

  previousTrack(accessToken) {
    return this.post('/me/player/previous', accessToken);
  },

  nextTrack(accessToken) {
    return this.post('/me/player/next', accessToken);
  },

  setRepeat(accessToken, state) {
    return this.put('/me/player/repeat', accessToken, null, { state });
  },

  setShuffle(accessToken, state) {
    return this.put('/me/player/shuffle', accessToken, null, { state });
  }
};

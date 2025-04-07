import { defineStore } from "pinia";
import axios from "axios";
import { generateRandomString, generateCodeChallenge } from '@/assets/utils/authUtils';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    codeVerifier: null,
  }),

  actions: {
    async login() {
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_REDIRECT_URI ||
        (import.meta.env.MODE === 'production'
          ? 'https://starboy.alwaysdata.net/callback'
          : 'http://localhost:5173/callback');
      const scopes = 'user-read-private user-read-email playlist-read-private user-library-read user-read-currently-playing user-read-playback-state user-modify-playback-state user-follow-read';

      this.codeVerifier = generateRandomString(128);
      localStorage.setItem('codeVerifier', this.codeVerifier);
      const codeChallenge = await generateCodeChallenge(this.codeVerifier);

      const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
      window.location = authUrl;
    },

    async getToken(code) {
      try {
        const clientId = '656fafd0a60d45bdb5757933f4ac7f18';
        const redirectUri = import.meta.env.MODE === 'production'
          ? 'https://starboy.alwaysdata.net/callback'
          : 'http://localhost:5173/callback';
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

        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération du token:', error.response?.data || error.message);
        throw error;
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

        return response.data;
      } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error.response?.data || error.message);
        this.logout();
        throw error;
      }
    },

    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  }
});

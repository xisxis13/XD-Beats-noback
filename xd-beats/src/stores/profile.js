import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { spotifyApi } from '@/services/spotifyApi';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    userProfile: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUserProfile() {
      const authStore = useAuthStore();
      if (!authStore.accessToken) return null;

      this.loading = true;
      this.error = null;

      try {
        const response = await spotifyApi.getUserProfile(authStore.accessToken);
        this.userProfile = response.data;
        return this.userProfile;
      } catch (error) {
        if (error.response?.status === 401) {
          await authStore.refreshAccessToken();
          return this.fetchUserProfile();
        }
        this.error = error.message || 'Erreur de chargement du profil';
        console.error('Erreur lors de la récupération du profile: ', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    userName: (state) => state.userProfile?.display_name || 'User',
    userImage: (state) => state.userProfile?.images?.[0]?.url,
    userFollowers: (state) => state.userProfile?.followers?.total || 0,
    userId: (state) => state.userProfile?.id,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
  }
});

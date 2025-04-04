import { useAuthStore } from "./auth";
import { useProfileStore } from "./profile";
import { usePlayerStore } from "./player";
import { useLibraryStore } from "./library";

export function initializeStores() {
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const playerStore = usePlayerStore();
  const libraryStore = useLibraryStore();

  if (authStore.isLoggedIn) {
    return Promise.all([
      profileStore.fetchUserProfile(),
      playerStore.fetchCurrentlyPlaying(),
      libraryStore.fetchUserSavedAlbums(8, 0),
      libraryStore.fetchUserSavedPlaylists(8, 0),
    ]).catch(error => {
      console.error("Erreur lors de l'initialisation des stores:", error);
    });
  }

  return Promise.resolve();
}

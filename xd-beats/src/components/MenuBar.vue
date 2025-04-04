<script setup>
import appIcon from '@/assets/icons/app-logo.svg';
import LibraryItem from './LibraryItem.vue';
import { useAuthStore } from '@/stores/auth';
import { useLibraryStore } from '@/stores/library';
import { RouterLink, useRoute } from 'vue-router';
import { House, Globe, Library, Plus } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const libraryStore = useLibraryStore();
const route = useRoute();
const savedAlbums = ref([]);
const savedPlaylists = ref([]);
const savedItems = ref([]);

const isActive = (url) => {
  return route.path === url;
};

const fetchAlbums = async () => {
  try {
    await libraryStore.fetchUserSavedAlbums();
    savedAlbums.value = libraryStore.savedAlbums;
  } catch (error) {
    console.error('Erreur lors du chargement des albums dans MenuBar:', error);
  }
};

const fetchPlaylists = async () => {
  try {
    await libraryStore.fetchUserSavedPlaylists();
    savedPlaylists.value = libraryStore.savedPlaylists;
  } catch (error) {
    console.error('Erreur lors du chargement des playlists dans MenuBar:', error);
  }
};

onMounted(async () => {
  if (authStore.accessToken) {
    await fetchAlbums();
    await fetchPlaylists();

    const combinedItems = [...savedAlbums.value, ...savedPlaylists.value];
    savedItems.value = combinedItems.sort(() => Math.random() - 0.5);
  }
});
</script>

<template>
  <div class="menubar-container box">
    <img class="app-icon" :src="appIcon" alt="app logo">

    <div class="menubar-list-container">
      <ul class="menubar-list">
        <li>
          <RouterLink class="menubar-item" :to="'/'" :class="{ active: isActive('/') }">
            <House class="menubar-icons" />
            <h4>Home</h4>
          </RouterLink>
        </li>

        <li>
          <RouterLink class="menubar-item" :to="'/browse'" :class="{ active: isActive('/browse') }">
            <Globe class="menubar-icons" />
            <h4>Browse</h4>
          </RouterLink>
        </li>

        <hr>

        <li>
          <RouterLink class="menubar-item" :to="'/library'" :class="{ active: isActive('/library') }">
            <Library class="menubar-icons" />
            <h4>Library</h4>
          </RouterLink>

          <button class="add-to-library-container">
            <Plus class="menubar-icons" />
          </button>
        </li>
      </ul>

      <div class="library-container">
        <LibraryItem v-for="item in savedItems" :key="item.id" :library-item="item" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.menubar-container {
  grid-area: menu;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  gap: 32px;

  padding: 24px 12px;
  width: 100%;

  overflow: hidden;
}

.app-icon {
  width: 127px;
  height: 36px;
}

.menubar-list-container {
  height: 100%;

  overflow: hidden;
}

.menubar-list-container,
.menubar-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  width: 100%;
}

.menubar-list {
  list-style: none;
}

.menubar-list li {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 12px;

  width: 100%;
  height: fit-content;
}

.menubar-item {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 8px;

  padding: 12px;
  width: 100%;
  height: 48px;

  border-radius: 100px;
  text-decoration: none;
}

.menubar-item h4 {
  color: var(--text);
}

.menubar-icons {
  width: 22px;

  color: var(--text);
}

.library-container {
  width: 100%;
  height: 100%;

  overflow: scroll;
}

.menubar-item.active {
  background-color: var(--light-orange);
}

.menubar-item.active h4,
.menubar-item.active .menubar-icons {
  color: var(--orange);
}

.menubar-container hr {
  width: 100%;
  border: solid 1px var(--light-content);
}

.add-to-library-container {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 80%;
  aspect-ratio: 1/1;

  border-radius: 100%;
  border: none;
  background: none;

  cursor: pointer;
}

.add-to-library-container:hover {
  background-color: var(--light-content);
}
</style>

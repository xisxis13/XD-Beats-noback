<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLibraryStore } from '@/stores/library';
import OverviewBannier from '@/components/OverviewBannier.vue';
import TrackList from '@/components/TrackList.vue';

const currentPlaylist = ref(null);
const route = useRoute();
const libraryStore = useLibraryStore();

const fetchPlaylist = async (playlistId) => {
  try {
    await libraryStore.fetchPlaylistById(playlistId);
    currentPlaylist.value = libraryStore.playlistSelected;
  } catch (error) {
    console.error('Erreur lors du chargement de la playlist:', error);
  }
};

const updatePlaylist = async (playlistId) => {
  if (playlistId) {
    await fetchPlaylist(playlistId);
  }
};

onMounted(async () => {
  const playlistId = route.params.playlistId;
  await updatePlaylist(playlistId);
});

watch(() => route.params.playlistId, async (newPlaylistId, oldPlaylistId) => {
  if (newPlaylistId !== oldPlaylistId) {
    await updatePlaylist(newPlaylistId);
  }
});
</script>

<template>
  <div class="playlist-overview-container box">
    <template v-if="currentPlaylist">
      <OverviewBannier :current="currentPlaylist" />
      <TrackList :track-list="currentPlaylist.tracks.items" :has-album-details="true" />
    </template>

    <template v-else>
      <h2>No playlist has been found</h2>
    </template>
  </div>
</template>

<style scoped>
.playlist-overview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  gap: 12px;

  overflow-y: scroll;
}
</style>

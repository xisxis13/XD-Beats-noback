<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLibraryStore } from '@/stores/library';
import OverviewBannier from '@/components/OverviewBannier.vue';
import TrackList from '@/components/TrackList.vue';

const currentAlbum = ref(null);
const route = useRoute();
const libraryStore = useLibraryStore();

const fetchAlbum = async (albumId) => {
  try {
    await libraryStore.fetchAlbumById(albumId);
    currentAlbum.value = libraryStore.albumSelected;
  } catch (error) {
    console.error('Erreur lors du chargement de l\'album:', error);
  }
};

const updateAlbum = async (albumId) => {
  if (albumId) {
    await fetchAlbum(albumId);
  }
};

onMounted(async () => {
  const albumId = route.params.albumId;
  await updateAlbum(albumId);
});

watch(() => route.params.albumId, async (newAlbumId, oldAlbumId) => {
  if (newAlbumId !== oldAlbumId) {
    await updateAlbum(newAlbumId);
  }
});
</script>

<template>
  <div class="album-overview-container box">
    <template v-if="currentAlbum">
      <OverviewBannier :current="currentAlbum" />
      <TrackList :track-list="currentAlbum.tracks.items" :has-album-details="false" />
    </template>

    <template v-else>
      <h2>No album has been found</h2>
    </template>
  </div>
</template>

<style scoped>
.album-overview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  gap: 12px;

  overflow-y: scroll;
}
</style>

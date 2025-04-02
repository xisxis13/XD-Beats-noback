<script>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSpotifyStore } from '@/stores/spotify';
import OverviewBannier from '@/components/OverviewBannier.vue';
import TrackList from '@/components/TrackList.vue';

export default {
  components: {
    OverviewBannier,
    TrackList,
  },
  setup() {
    const currentPlaylist = ref(null);
    const route = useRoute();
    const store = useSpotifyStore();

    const fetchPlaylist = async (playlistId) => {
      try {
        await store.fetchPlaylistById(playlistId);
        currentPlaylist.value = store.playlistSelected;
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

    return {
      currentPlaylist,
    };
  },
};
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

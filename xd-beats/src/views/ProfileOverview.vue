<script>
import { onMounted, ref, watch } from 'vue';
import { useSpotifyStore } from '@/stores/spotify';
import ColorThief from 'colorthief';
import TrackList from '@/components/TrackList.vue';
import ObjectList from '@/components/ObjectList.vue';

export default {
  components: {
    TrackList,
    ObjectList,
  },
  data() {
    return {
      store: useSpotifyStore(),
      followedArtists: [],
      publicPlaylists: [],
      isLoading: false,
    }
  },
  methods: {
    async fetchFollowedArtists() {
      this.isLoading = true;
      try {
        await this.store.fetchUserFollowedArtists();
        this.followedArtists = this.store.followedArtists;
      } catch (error) {
        console.error('Erreur lors du chargement des artistes suivis:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchUserPublicPlaylists(limit, offset) {
      this.isLoading = true;
        try {
          await this.store.fetchUserPublicPlaylists(limit, offset);
          this.publicPlaylists = this.store.publicPlaylists;
        } catch (error) {
          console.error('Erreur lors du chargement des playlists public:', error);
        } finally {
          this.isLoading = false;
        }
    },
  },
  setup(props) {
    const dominantColor = ref('');
    const cover = ref(null);

    const getDominantColor = () => {
      const colorThief = new ColorThief();
      const img = cover.value;

      if (img && img.complete) {
        const color = colorThief.getColor(img);
        dominantColor.value = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      } else if (img) {
        img.addEventListener('load', () => {
          const color = colorThief.getColor(img);
          dominantColor.value = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        });
      }
    };

    const gradientStyle = () => {
      if (!dominantColor.value) return {};

      const rgb = dominantColor.value;
      const rgbaOpaque = rgb.replace('rgb', 'rgba').replace(')', ', 0.8)');
      const rgbaTransparent = rgb.replace('rgb', 'rgba').replace(')', ', 0)');

      return {
        background: rgb,
        background: `-moz-linear-gradient(180deg, ${rgbaOpaque} 0%, ${rgbaTransparent} 100%)`,
        background: `-webkit-linear-gradient(180deg, ${rgbaOpaque} 0%, ${rgbaTransparent} 100%)`,
        background: `linear-gradient(180deg, ${rgbaOpaque} 0%, ${rgbaTransparent} 100%)`,
        filter: `progid:DXImageTransform.Microsoft.gradient(startColorstr="#aa29cb", endColorstr="#aa29cb", GradientType=1)`,
      };
    };

    onMounted(() => {
      getDominantColor();
    });

    watch(() => props.current, (newCurrent, oldCurrent) => {
      if (newCurrent !== oldCurrent) {
        dominantColor.value = '';
        getDominantColor();
      }
    }, { deep: true });

    return {
      dominantColor,
      cover,
      gradientStyle,
    };
  },
  async mounted() {
    if (this.store.accessToken) {
      await this.fetchFollowedArtists();
      await this.fetchUserPublicPlaylists(50, 5);
    }
  },
}
</script>

<template>
  <div class="profile-overview-container box">
    <template v-if="store.userProfile">
      <div class="bannier-container" :style="gradientStyle()">
        <img
          ref="cover"
          :src="store.userProfile.images[0].url"
          :alt="store.userProfile.name + ' cover'"
          class="bannier-img circle"
          crossorigin="anonymous"
        />

        <div class="bannier-details-container">
          <h5 class="current-object-type light">User</h5>
          <h1 class="current-object-name">{{ store.userProfile.display_name }}</h1>
          <h5 class="current-object-details">
            <span v-if="store.userProfile.followers.total < 2" class="light"> • {{ store.userProfile.followers.total }} follower</span>
            <span v-else class="light"> • {{ store.userProfile.followers.total }} followers</span>
            <span v-if="followedArtists.length < 2" class="light"> • {{ followedArtists.length }} Followed Artist</span>
            <span v-else class="light"> • {{ followedArtists.length }} Followed Artists</span>
          </h5>
        </div>
      </div>

      <div class="public-playlists-container" v-if="publicPlaylists.length > 0">
        <h3>Public Playlists</h3>
        <ObjectList :object-list="publicPlaylists" />
      </div>

      <div class="followed-artists-container" v-if="followedArtists.length > 0">
        <h3>Followed Artirsts</h3>
        <ObjectList :object-list="followedArtists" />
      </div>

      <div v-else-if="isLoading" class="loading-container">
        <p>Loading...</p>
      </div>

      <div v-else class="no-artists-container">
        <h3>You don't follow any artists</h3>
      </div>
    </template>

    <template v-else>
      <h2>No user has been found</h2>
    </template>
  </div>
</template>

<style scoped>
.profile-overview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  gap: 12px;
  overflow-y: scroll;
  padding-bottom: 24px;
}

.public-playlists-container,
.followed-artists-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: left;
  gap: 16px;

  padding: 16px;
  width: 100%;
}





.loading-container,
.no-artists-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  width: 100%;
}
</style>

<script>
import { onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import ColorThief from 'colorthief';

export default {
  components: {
    RouterLink,
  },
  props: {
    current: {
      type: Object,
      required: true,
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
};
</script>

<template>
  <div class="bannier-container" :style="gradientStyle()">
    <template v-if="current.type === 'album'">
      <img
        ref="cover"
        :src="current.images[0].url"
        :alt="current.name + ' cover'"
        class="bannier-img"
        crossorigin="anonymous"
      />

      <div class="bannier-details-container">
        <h5 class="current-object-type light">Album</h5>
        <h1 class="current-object-name">{{ current.name }}</h1>
        <h5 class="current-object-details">
          <RouterLink :to="`/artists/${current.artists[0].id}`" class="current-album-link">{{ current.artists[0].name }}</RouterLink>
          <span v-if="current.tracks.items.length < 2" class="light"> • {{ current.tracks.items.length }} song</span>
          <span v-else class="light"> • {{ current.tracks.items.length }} songs</span>
          <span class="light"> • {{ current.release_date }}</span>
        </h5>
      </div>
    </template>

    <template v-if="current.type === 'playlist'">
      <img
        ref="cover"
        :src="current.images[0].url"
        :alt="current.name + ' cover'"
        class="bannier-img"
        crossorigin="anonymous"
      />

      <div class="bannier-details-container">
        <h5 class="current-object-type light">Playlist</h5>
        <h1 class="current-object-name">{{ current.name }}</h1>
        <h5 class="current-object-details">
          <RouterLink :to="`/users/${current.owner.id}`" class="current-owner-link">{{ current.owner.display_name }}</RouterLink>
          <span v-if="current.tracks.items.length < 2" class="light"> • {{ current.tracks.items.length }} song</span>
          <span v-else class="light"> • {{ current.tracks.items.length }} songs</span>
          <span v-if="current.followers.total < 2" class="light"> • {{ current.followers.total }} follower</span>
          <span v-else class="light"> • {{ current.followers.total }} followers</span>
        </h5>
      </div>
    </template>

    <!-- <template v-if="current.type === 'user'">
      <img
        ref="cover"
        :src="current.images[0].url"
        :alt="current.name + ' cover'"
        class="bannier-img circle"
        crossorigin="anonymous"
      />

      <div class="bannier-details-container">
        <h5 class="current-object-type light">User</h5>
        <h1 class="current-object-name">{{ current.display_name }}</h1>
        <h5 class="current-object-details">
          <span v-if="current.tracks.items.length < 2" class="light"> • {{ current.tracks.items.length }} song</span>
          <span v-else class="light"> • {{ current.tracks.items.length }} songs</span>
          <span v-if="current.followers.total < 2" class="light"> • {{ current.followers.total }} follower</span>
          <span v-else class="light"> • {{ current.followers.total }} followers</span>
        </h5>
      </div>
    </template> -->
  </div>
</template>

<style>
.bannier-container {
  display: flex;
  align-items: end;
  justify-content: left;
  gap: 24px;

  padding: 16px;
  width: 100%;

  border-radius: 20px 20px 0 0;
}

.bannier-img {
  width: 220px;
  aspect-ratio: 1/1;

  object-fit: cover;

  border-radius: 20px;
}

.bannier-img.circle {
  border-radius: 100%;
}

.bannier-details-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 4px;

  padding: 8px 0;
}

.current-album-link,
.current-owner-link {
  color: var(--text);
  text-decoration: none;
}

.current-album-link:hover,
.current-owner-link:hover {
  text-decoration: underline;
}
</style>

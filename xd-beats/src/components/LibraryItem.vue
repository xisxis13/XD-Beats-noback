<script>
import { RouterLink } from 'vue-router';

export default {
  components: {
    RouterLink,
  },
  props: {
    libraryItem: {
      type: Object,
      required: true,
    }
  }
}
</script>

<template>
  <template v-if="libraryItem?.album">
    <RouterLink class="library-item-container" :to="`/albums/${libraryItem.album.id}`">
      <img class="library-item-square-img" :src="libraryItem.album.images?.[0]?.url" :alt="libraryItem.album.name + ' album cover'">

      <div class="library-item-details-container">
        <h5 class="library-item-name">{{ libraryItem.album.name }}</h5>
        <h6 class="library-item-type light">Album</h6>
      </div>
    </RouterLink>
  </template>

  <template v-else-if="libraryItem?.type === 'playlist'">
    <RouterLink class="library-item-container" :to="`/playlists/${libraryItem.id}`">
      <img class="library-item-square-img" :src="libraryItem.images?.[0]?.url" :alt="libraryItem.name + ' album cover'">

      <div class="library-item-details-container">
        <h5 class="library-item-name">{{ libraryItem.name }}</h5>
        <h6 class="library-item-type light">Playlist</h6>
      </div>
    </RouterLink>
  </template>

  <h6 v-else>Nothing in the library</h6>
</template>

<style>
.library-item-container {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 12px;

  margin-bottom: 4px;
  padding: 6px 8px;
  width: 100%;

  border-radius: 18px;
  cursor: pointer;
  text-decoration: none;

  overflow: hidden;
}

.library-item-container:hover {
  background-color: var(--light-content);
}

.library-item-square-img {
  width: 44px;
  aspect-ratio: 1/1;

  border-radius: 10px;
}

.library-item-details-container {
  width: 100%;
  overflow: hidden;
}

.library-item-name {
  margin-bottom: 4px;
}

.library-item-name,
.library-item-type {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}
</style>

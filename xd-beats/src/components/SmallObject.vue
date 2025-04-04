<script>
import { RouterLink } from 'vue-router';

export default {
  components: {
    RouterLink,
  },
  props: {
    current: {
      type: Object,
      required: true,
    }
  }
}
</script>

<template>
  <template v-if="current.type === 'artist'">
    <RouterLink class="small-object-container small-circle" :to="`/artists/${current.id}`">
      <img
        class="small-object-img"
        :src="current.images && current.images.length > 0 ? current.images[0].url : ''"
        :alt="current.name + ' icon'"
      >
      <div class="small-object-details-container">
        <h5 class="small-object-name">{{ current.name }}</h5>
      </div>
    </RouterLink>
  </template>

  <template v-if="current.type === 'playlist'">
    <RouterLink class="small-object-container small-square" :to="`/playlists/${current.id}`">
      <img
        class="small-object-img"
        :src="current.images && current.images.length > 0 ? current.images[0].url : ''"
        :alt="current.name + ' icon'"
      >
      <div class="small-object-details-container">
        <h5 class="small-object-name">{{ current.name }}</h5>
        <h6 class="small-object-owner-name light">by {{ current.owner.display_name }}</h6>
      </div>
    </RouterLink>
  </template>
</template>

<style scoped>
.small-object-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: 100%;
  max-width: 160px;

  text-decoration: none;
}

.small-object-container.small-circle .small-object-img {
  width: 120px;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 100%;
}

.small-object-container.small-square .small-object-img {
  width: 160px;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 15px;
}

.small-object-details-container {
  width: 100%;
  overflow: hidden;
}

.small-object-container.small-circle .small-object-details-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.small-object-container.small-square .small-object-details-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: left;
  gap: 4px;
  padding: 0 4px;
}

.small-object-name {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.small-object-container.small-circle .small-object-name {
  text-align: center;
}

.small-object-container.small-square .small-object-name,
.small-object-container.small-square .small-object-owner-name {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
</style>

<script>
import { Clock3 } from 'lucide-vue-next';
import InlineTrack from './InlineTrack.vue';

export default {
  components: {
    Clock3,
    InlineTrack,
  },
  props: {
    trackList: {
      type: Array,
      required: true,
    },
    hasAlbumDetails: {
      type: Boolean,
      required: true,
    },
  }
}
</script>

<template>
  <div class="track-list-container">
    <!-- playlist -->
    <template v-if="hasAlbumDetails">
      <div class="track-list-title-container with-album-details">
        <h5 class="light">#</h5>
        <h5 class="light">Title</h5>
        <h5 class="light">Album</h5>
        <Clock3 class="track-duration-icon light"/>
      </div>

      <hr>

      <template v-for="(track, index) in trackList" :key="track.id">
        <InlineTrack :track="track" :has-album-details="hasAlbumDetails" :index="index+1" />
      </template>
    </template>

    <!-- autre -->
    <template v-else>
      <div class="track-list-title-container">
        <h5 class="light">#</h5>
        <h5 class="light">Title</h5>
        <Clock3 class="track-duration-icon light"/>
      </div>

      <hr>

      <template v-for="track in trackList" :key="track.id">
        <InlineTrack :track="track" :has-album-details="hasAlbumDetails" />
      </template>
    </template>
  </div>
</template>

<style>
.track-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  gap: 8px;

  padding: 0 24px;
  width: 100%;
  height: 100%;
}

.track-list-title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  padding: 0 12px;
  width: 100%;
}

.track-list-container hr {
  width: 100%;

  border-color: var(--light-content);
}

.track-list-title-container h5:nth-child(1) {
  width: 25px;

  text-align: center;
}

.track-list-title-container h5:nth-child(2),
.track-list-title-container.with-album-details h5:nth-child(3) {
  width: 100%;

  text-align: left;
}

.track-duration-icon {
  width: 85px;
  max-height: 20px;
}
</style>

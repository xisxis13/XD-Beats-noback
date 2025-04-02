<script>
import playIcon from '@/assets/icons/play-icon.svg';
import explicitIcon from '@/assets/icons/explicit-icon.svg';

export default {
  props: {
    track: {
      type: Object,
      required: true,
    },
    hasAlbumDetails: {
      type: Boolean,
      required: true,
    },
    index: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      explicitIcon,
      playIcon,
    }
  },
  methods: {
    durationMsToMinutes(durationMs) {
      const minutes = Math.floor((durationMs / 1000) / 60);
      const secondes = Math.floor((durationMs / 1000) % 60);

      if (secondes < 10) {
        return minutes + ":0" + secondes;
      } else {
        return minutes + ":" + secondes;
      }
    }
  }
}
</script>

<template>
  <div v-if="hasAlbumDetails" class="inline-track-container with-album-details">
    <h4 class="inline-track-index">{{ index }}</h4>
    <img class="inline-track-play-icon" :src="playIcon" alt="play icon">

    <div class="inline-track-details">
      <h4 class="inline-track-name">{{ track.track.name }}</h4>
      <div class="inline-track-artist-container">
        <img
          v-if="track.track.explicit"
          class="explicit-icon"
          :src="explicitIcon"
          alt="explicit icon"
        >
        <template v-for="(artist, index) in track.track.artists" :key="artist.id">
          <RouterLink class="inline-track-artist-link" :to="`/artists/${artist.id}`">
            <h6 class="inline-track-artist-name light">{{ artist.name }}</h6>
            <span class="light" v-if="index < track.track.artists.length - 1">, </span>
          </RouterLink>
        </template>
      </div>
    </div>

    <RouterLink class="inline-track-album-link" :to="`/albums/${track.track.album.id}`">
      <h5 class="inline-track-album">{{ track.track.album.name }}</h5>
    </RouterLink>

    <h6 class="inline-track-duration light">{{ durationMsToMinutes(track.track.duration_ms) }}</h6>
  </div>

  <div v-else class="inline-track-container">
    <h4 class="inline-track-index">{{ track.track_number }}</h4>
    <img class="inline-track-play-icon" :src="playIcon" alt="play icon">

    <div class="inline-track-details">
      <h4 class="inline-track-name">{{ track.name }}</h4>
      <div class="inline-track-artist-container">
        <img
          v-if="track.explicit"
          class="explicit-icon"
          :src="explicitIcon"
          alt="explicit icon"
        >
        <template v-for="(artist, index) in track.artists" :key="artist.id">
          <RouterLink class="inline-track-artist-link" :to="`/artists/${artist.id}`">
            <h6 class="inline-track-artist-name light">{{ artist.name }}</h6>
            <span class="light" v-if="index < track.artists.length - 1">, </span>
          </RouterLink>
        </template>
      </div>
    </div>

    <h6 class="inline-track-duration light">{{ durationMsToMinutes(track.duration_ms) }}</h6>
  </div>
</template>

<style>
.inline-track-container {
  display: grid;
  grid-template-columns: 25px 1fr 40px;
  column-gap: 16px;
  align-items: center;

  padding: 6px 12px;
  width: 100%;

  border-radius: 18px;
}

.inline-track-container:hover {
  background-color: var(--light-content);
}

.inline-track-container.with-album-details {
  grid-template-columns: 25px 1fr 1fr 40px;
}

.inline-track-index {
  width: 100%;
  text-align: center;
}

.inline-track-container:hover .inline-track-index {
  display: none;
}

.inline-track-play-icon {
  display: none;

  cursor: pointer;
}

.inline-track-container:hover .inline-track-play-icon {
  display: block;
}

.inline-track-details {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 4px;

  width: 100%;

  overflow: hidden;
}

.inline-track-name,
.inline-track-artist-name,
.inline-track-album {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.inline-track-artist-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  width: 100%;
  overflow: hidden;
}

.inline-track-artist-link {
  display: flex;
  align-items: center;
  text-decoration: none;

  overflow: visible;
}

.inline-track-name-link,
.inline-track-album-link {
  display: flex;
  align-items: center;
  max-width: 100%;
  width: 100%;
  overflow: hidden;
  text-decoration: none;
}

.inline-track-artist-name:hover {
  text-decoration: underline;
}

.inline-track-album-link {
  text-decoration: none;
  width: 100%;
  overflow: hidden;
}

.inline-track-album-link:hover {
  color: var(--text);
  text-decoration: underline;
}

.inline-track-duration {
  text-align: center;
}
</style>

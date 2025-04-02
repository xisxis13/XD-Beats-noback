<script>
import { Play } from 'lucide-vue-next';
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
  components: {
    Play,
  },
  data() {
    return {
      explicitIcon,
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
  <div class="inline-track-container">
    <template v-if="hasAlbumDetails">
      <h4 class="inline-track-index">{{ index }}</h4>
      <Play class="inline-track-play-icon"/>

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

      <!-- to confirm -->
      <RouterLink class="inline-track-album-link" :to="`/albums/${track.track.album.id}`">
        <h5 class="inline-track-album">{{ track.track.album.name }}</h5>
      </RouterLink>

      <h6 class="inline-track-duration light">{{ durationMsToMinutes(track.track.duration_ms) }}</h6>
    </template>

    <template v-else>
      <h4 class="inline-track-index">{{ track.track_number }}</h4>
      <Play class="inline-track-play-icon"/>

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
    </template>
  </div>
</template>

<style>
.inline-track-container {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 16px;

  padding: 6px 12px;
  width: 100%;

  border-radius: 18px;
}

.inline-track-play-icon {
  display: none;
}

.inline-track-index {
  width: 25px;
  text-align: center;
}

.inline-track-container:hover {
  background-color: var(--light-content);
}

.inline-track-container:hover .inline-track-play-icon {
  display: block;

  height: 18px;
  width: 25px;

  color: var(--text);
  cursor: pointer;
}

.inline-track-container:hover .inline-track-index {
  display: none;
}

.inline-track-details,
.inline-track-album,
.inline-track-album-link {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 4px;

  width: 100%;
}

.inline-track-name,
.inline-track-artist-name,
.inline-track-album,
.inline-track-album-link {
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

.inline-track-artist-link,
.inline-track-name-link {
  display: flex;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
  text-decoration: none;
}

.inline-track-artist-name:hover {
  text-decoration: underline;
}

.inline-track-duration {
  width: 80px;
  text-align: center;
}

.inline-track-album-link {
  text-decoration: none;
}

.inline-track-album-link:hover {
  color: var(--text);
  text-decoration: underline;
}
</style>

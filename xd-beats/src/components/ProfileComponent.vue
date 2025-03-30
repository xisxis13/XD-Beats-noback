<script>
import defaultAvatar from '@/assets/icons/default-avatar.svg';
import { useSpotifyStore } from '@/stores/spotify';
import { RouterLink } from 'vue-router';

export default {
  components: {
    RouterLink
  },
  data() {
    return {
      defaultAvatar,
      store: useSpotifyStore(),
    }
  },
}
</script>

<template>
  <div class="profile-component-container box">
    <RouterLink :to="'/profile'" class="profile-container">
      <template v-if="store.userProfile?.images">
        <img class="profile-component-avatar" :src="store.userProfile.images[0].url" :alt="store.userProfile.display_name + ' avatar'">
        <h4 class="profile-component-name">{{ store.userProfile.display_name }}</h4>
      </template>

      <template v-else>
        <img class="profile-component-avatar" :src="defaultAvatar" alt="default avatar">
        <h4 class="profile-component-name">user</h4>
      </template>
    </RouterLink>
  </div>
</template>

<style>
.profile-component-container {
  grid-area: profile;

  padding: 8px;
  width: 100%;

  overflow: hidden;
}

.profile-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: 100%;
  height: 100%;

  border-radius: 12px;
  text-decoration: none;
}

.profile-container:hover {
  background-color: var(--light-content);
}

.profile-component-avatar {
  height: 100%;
  aspect-ratio: 1/1;

  border-radius: 100%;
}
</style>

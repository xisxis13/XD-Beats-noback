<script setup>
import defaultAvatar from '@/assets/icons/default-avatar.svg';
import { useProfileStore } from '@/stores/profile';
import { RouterLink } from 'vue-router';

const profileStore = useProfileStore();
</script>

<template>
  <div class="profile-component-container box">
    <RouterLink :to="'/profile'" class="profile-container" aria-label="Accéder au profil utilisateur">
      <template v-if="profileStore.userProfile?.images && profileStore.userProfile.images.length > 0">
        <img
          class="profile-component-avatar"
          :src="profileStore.userProfile.images[0].url"
          :alt="profileStore.userProfile.display_name + ' avatar'"
        >
        <h4 class="profile-component-name">{{ profileStore.userProfile.display_name }}</h4>
      </template>

      <template v-else>
        <img
          class="profile-component-avatar"
          :src="defaultAvatar"
          alt="Avatar par défaut"
        >
        <h4 class="profile-component-name">{{ profileStore.userName }}</h4>
      </template>
    </RouterLink>
  </div>
</template>

<style scoped>
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
  transition: background-color 0.2s ease;
}

.profile-container:hover {
  background-color: var(--light-content);
}

.profile-component-avatar {
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 100%;
  object-fit: cover;
}

.profile-component-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

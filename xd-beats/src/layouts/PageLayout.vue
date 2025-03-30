<script setup>
import { RouterView } from 'vue-router';
import MenuBar from '@/components/MenuBar.vue';
import ProfileComponent from '@/components/ProfileComponent.vue';
import NowPlaying from '@/components/NowPlaying.vue';
import MusicPlayer from '@/components/MusicPlayer.vue';
import SearchBar from '@/components/SearchBar.vue';
</script>

<template>
  <div class="app">
    <MenuBar/>
    <ProfileComponent/>
    <NowPlaying/>
    <MusicPlayer/>
    <SearchBar/>

    <RouterView />
  </div>
</template>

<style>
.app {
  display: grid;
  grid-template-areas:
    "menu search profile"
    "menu main now"
    "menu player player";
  grid-template-columns: 200px 1fr 250px;
  grid-template-rows: 56px 1fr 90px;
  column-gap: 12px;
  row-gap: 12px;

  padding: 12px;
  width: 100vw;
  height: 100vh;

  background-color: var(--background);
  color: var(--white);

  overflow: hidden;
}
</style>

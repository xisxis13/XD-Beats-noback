<script setup>
import { RouterView } from 'vue-router'
</script>

<template id="app">
  <RouterView />
  <h1>I am a layout</h1>
</template>

<style>
#app {
  display: grid;
  grid-template-areas:
  "menu search settings"
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

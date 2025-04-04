<script>
import SmallObject from './SmallObject.vue';

export default {
  components: {
    SmallObject,
  },
  props: {
    objectList: {
      type: Array,
      required: true,
    }
  }
}
</script>

<template>
  <div class="object-list-container">
    <SmallObject v-for="object in objectList" :key="object.id" :current="object" />
  </div>
</template>

<style>
.object-list-container {
  display: flex;
  align-items: start;
  justify-content: left;
  gap: 16px;

  width: 100%;

  overflow: scroll;
}
</style>

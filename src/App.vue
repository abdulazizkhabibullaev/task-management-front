<template>
  <div class="app"> <app-layout /> </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppLayout from './layouts/AppLayout.vue';
import { useMainStore } from './stores/main';

const mainStore = useMainStore();

onMounted(async () => {
  if (!mainStore.token) return;
  await mainStore.getMe();
});
</script>

<style scoped lang="scss">
.app {
  background: #f6f6f7;
  width: 100%;
}
</style>

<style lang="scss">
.app {
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>

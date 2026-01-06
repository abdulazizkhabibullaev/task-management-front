<template>
  <component :is="icon" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { defineAsyncComponent } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});
const icons = import.meta.glob('@/assets/icons/*.svg');

const icon = computed(() => {
  return defineAsyncComponent(
    () => icons[`/src/assets/icons/${props.name}.svg`]() as Promise<any>,
  );
});
</script>

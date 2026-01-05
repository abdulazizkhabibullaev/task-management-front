<template>
  <el-card class="common-card" v-bind="$attrs" :style="dynamicStyle" :shadow="shadow">
    <slot> </slot>
  </el-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  fullWidth: {
    type: Boolean,
    default: false,
  },
  borderRadius: {
    type: String,
    required: false,
  },
  width: {
    type: String,
    required: false,
  },
  padding: {
    type: String,
    required: false,
  },
  margin: {
    type: Number,
    required: false,
  },
  shadow: {
    type: String,
    default: 'never',
  },
});
const dynamicStyle = computed(() => {
  const style: Record<string, any> = {};

  if (props.width) style.width = props.width;
  if (props.padding) style.padding = props.padding;
  if (props.margin) style.margin = props.margin;
  if (props.borderRadius) style.borderRadius = props.borderRadius;
  if (props.fullWidth) style.width = '100%';

  return style;
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/breakpoints' as *;
@use '@/assets/scss/variables' as *;

.common-card {
  @include mobile {
    --el-card-padding: $spacing-sm;
  }

  :deep(.el-card__body) {
    @include mobile {
      padding: $spacing-sm;
    }
  }
}
</style>

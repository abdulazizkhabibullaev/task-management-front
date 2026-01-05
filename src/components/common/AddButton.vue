<template>
  <el-button
    @click="() => $emit('click')"
    class="btn"
    v-bind="$attrs"
    :disabled="props.disabled"
  >
    <el-icon>
      <Plus :style="{ color: props.color }" />
    </el-icon>
  </el-button>
</template>

<script lang="ts" setup name="UButton">
import { Plus } from '@element-plus/icons-vue';
const $emit = defineEmits<{
  (e: 'click'): void;
}>();

const props = defineProps({
  color: {
    type: String,
    default: '#000000',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.btn {
  border-radius: 20px;
  background-color: inherit;
  width: 5%;
  height: 5%;
  color: black;
}
</style>

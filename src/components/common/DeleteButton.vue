<template>
  <el-button
    @click="(e: any) => $emit('click', e)"
    class="btn"
    v-bind="$attrs"
    type="primary"
  >
    <v-icon name="delete" />
  </el-button>
</template>

<script lang="ts" setup name="UButton">
const $emit = defineEmits<{
  (e: 'click', event: any): void;
}>();
</script>

<style scoped lang="scss">
.btn {
  border: none;
  width: 20px;
  height: 20px;
  background-color: inherit;
  padding: 0;
}
</style>

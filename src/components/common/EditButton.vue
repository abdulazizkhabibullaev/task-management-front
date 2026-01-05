<template>
  <el-button
    @click="(e: any) => $emit('click', e)"
    class="btn"
    v-bind="$attrs"
    type="primary"
  >
    <v-icon name="edit" />
  </el-button>
</template>

<script lang="ts" setup name="UButton">
const $emit = defineEmits<{
  (e: 'click', event?: any): void;
}>();
</script>

<style scoped lang="scss">
.btn {
  border: none;
  // width: 50px;
  // height: 50px;
  background-color: inherit;
}
</style>

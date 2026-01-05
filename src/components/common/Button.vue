<template>
  <el-button
    @click="() => $emit('click')"
    class="u-btn"
    :style="dynamicStyle"
    v-bind="$attrs"
    :type="props.type"
    :disabled="props.disabled"
    :loading="props.loading"
  >
    <span :style="textStyle">
      {{ props.name }}
    </span>
    <slot></slot>
  </el-button>
</template>

<script lang="ts" setup name="UButton">
import { ButtonType } from '@/common/types/common';
import { computed } from 'vue';

const $emit = defineEmits<{
  (e: 'click'): void;
}>();

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  w: {
    type: String,
    required: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  fontWeight: {
    type: String,
    required: false,
  },
  fontSize: {
    type: String,
    required: false,
  },
  lineHeight: {
    type: String,
    required: false,
  },
  padding: {
    type: String,
    required: false,
  },
  mTop: {
    type: String,
    required: false,
  },
  borderRadius: {
    type: String,
    required: false,
  },
  margin: {
    type: String,
    required: false,
  },
  type: {
    enum: ButtonType,
    default: ButtonType.PRIMARY,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const dynamicStyle = computed(() => {
  const style: Record<string, any> = {};

  if (props.w) style.width = props.w;
  if (props.fontWeight) style.fontWeight = props.fontWeight;
  if (props.padding) style.padding = props.padding;
  if (props.margin) style.margin = props.margin;
  if (props.mTop) style.marginTop = props.mTop;
  if (props.borderRadius) style.borderRadius = props.borderRadius;
  if (props.fullWidth) style.width = '100%';

  return style;
});

const textStyle = computed(() => {
  const style: Record<string, any> = {};

  if (props.fontWeight) style.fontWeight = props.fontWeight;
  if (props.fontSize) style.fontSize = props.fontSize;
  if (props.lineHeight) style.lineHeight = props.lineHeight;

  return style;
});
</script>

<style scoped lang="scss"></style>

<template>
  <el-select
    v-model="selected"
    :placeholder="props.placeholder"
    :multiple="props.multiple"
    :clearable="props.clearable"
    :filterable="props.filterable"
    :collapse-tags="props.collapseTags"
    :collapse-tags-tooltip="props.showOnHover"
    @change="(val: any) => $emit('change', val)"
    :no-data-text="$t('COMMON.NOTHING_FOUND')"
    :no-match-text="$t('COMMON.NOTHING_FOUND')"
    :loading-text="$t('COMMON.LOADING')"
    :remote="props.remote"
    remote-show-suffix
    :remote-method="(search: string) => getOptions({ search })"
  >
    <el-option
      v-for="item in options"
      :key="utils.getObjectValue(item, props.selectKey)"
      :label="utils.getObjectValue(item, props.selectLabel)"
      :value="utils.getObjectValue(item, props.selectKey)"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { $api } from '@/common/api';
import { utils } from '@/common/utils/common';
import { onMounted } from 'vue';
import { watch } from 'vue';
import { ref } from 'vue';

const props = defineProps({
  options: {
    default: [],
  },
  placeholder: {
    type: String,
    default: '',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  filterable: {
    type: Boolean,
    default: false,
  },
  collapseTags: {
    type: Boolean,
    default: false,
  },
  defaultOption: {
    required: false,
  },
  selectKey: {
    type: String,
    default: '_id',
  },
  selectLabel: {
    type: String,
    default: 'name',
  },
  showOnHover: {
    type: Boolean,
    default: true,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  remoteUrl: {
    type: String,
  },
  requestMethod: {
    type: String,
    default: 'post',
  },
  isAuto: {
    type: Boolean,
    default: true,
  },
  queryOptions: {
    required: false,
  },
});
const selected = ref(props.defaultOption);
const options = ref(props.options as any[]);
watch(
  () => props.defaultOption,
  newValue => (selected.value = newValue),
);
watch(
  () => props.options,
  newValue => (options.value = newValue),
);

const $emit = defineEmits<{
  (e: 'change', key: any): void;
}>();

const getOptions = async (params?: any) => {
  if (!props.remote || !props.remoteUrl) return;
  const payload = {
    page: 1,
    limit: 50,
    ...params,
    ...(props.queryOptions || {}),
  };

  const data = await $api.common.getChoose(
    props.requestMethod,
    props.remoteUrl as string,
    payload,
  );
  if (Array.isArray(data)) options.value = data;
  else options.value = data.data;
};

onMounted(() => {
  if (props.isAuto) getOptions();
});

defineExpose({
  getOptions,
});
</script>

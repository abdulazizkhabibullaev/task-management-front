<template>
  <div class="select">
    <el-form-item :prop="props.prop" ref="selectWrapper" :label="props.label">
      <el-select
        ref="select"
        :model-value="props.modelValue"
        filterable
        :remote="isRemote"
        :remote-method="getOptions"
        :loading="loading"
        :clearable="props.clearable"
        @change="handleChange"
        value-key="_id"
        :placeholder="$t('COMMANDS.SELECT')"
        :disabled="props.disabled"
        :multiple="props.multiple"
        :no-data-text="$t('COMMON.NOTHING_FOUND')"
        :no-match-text="$t('COMMON.NOTHING_FOUND')"
        :loading-text="$t('COMMON.LOADING')"
        :collapse-tags="props.collapseTags"
        :collapse-tags-tooltip="props.collapseTags"
        remote-show-suffix
      >
        <el-option
          v-for="item in options"
          :key="item[props.selectKey]"
          :label="getLabel(item)"
          :value="item"
          :disabled="props.disabledOptions.includes(item[props.selectKey])"
        >
        </el-option>
        <template #empty>
          <span>{{ $t('COMMON.NOTHING_FOUND') }}</span>
        </template>
      </el-select>
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { $api } from '@/common/api';
import { utils } from '@/common/utils/common';
import { onMounted, reactive, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    required: true,
  },
  isRemote: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  prop: {
    type: String,
    required: false,
  },
  dataUrl: {
    type: String,
    required: false,
  },
  method: {
    type: String,
    required: false,
    default: 'post',
  },
  queryOptions: {
    type: Object,
    default: {},
  },
  label: {
    type: String,
    default: '',
  },
  selectKey: {
    type: String,
    default: '_id',
  },
  selectLabel: {
    type: String,
    default: 'name',
  },
  options: {
    default: [],
    type: Array,
  },
  defaultOption: {
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  collapseTags: {
    type: Boolean,
    default: false,
  },
  disabledOptions: {
    type: Array,
    default: [],
  },
});

const options = ref<any[]>(props.options);
const loading = ref(false);
const initialCallMade = ref(false);

watch(
  () => props.defaultOption,
  (newValue: any) => {
    if (!options.value.length && newValue) {
      if (Array.isArray(newValue)) options.value = newValue;
      else options.value = [newValue];
    }
  },
);
const payload = reactive({
  page: 1,
  limit: 50,
  search: '',
  ...props.queryOptions,
});

watch(
  () => props.queryOptions,
  newValue => {
    if (newValue && Object.values(newValue).length) Object.assign(payload, newValue);
  },
);

const $emit = defineEmits<{
  (e: 'change', key: any): void;
  (e: 'options', options: any[]): void;
}>();

const getOptions = async (search: string, query?: any) => {
  try {
    if (!search && !query && !payload.search && initialCallMade.value) return;

    loading.value = true;
    payload.search = search;
    if (props.dataUrl) {
      const response = await $api.common.getChoose(
        props.method,
        search && props.method == 'get'
          ? props.dataUrl + `?search=${search}`
          : props.dataUrl,
        { ...payload, ...query },
      );
      options.value = Array.isArray(response) ? response : response.data;
      initialCallMade.value = true;
    } else options.value = props.options;
    $emit('options', options.value);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

const getLabel = (item: any) => utils.getObjectValue(item, props.selectLabel);

const handleChange = (selectedItem: any) => {
  $emit('change', selectedItem);
};

onMounted(() => {
  if (props.defaultOption && !options.value.length) {
    const newValue = props.defaultOption;
    if (Array.isArray(newValue)) options.value = newValue;
    else if (typeof newValue == 'object' && Object.values(newValue).length)
      options.value = [newValue];
  }
});
defineExpose({
  getOptions,
});
</script>

<style lang="scss" scoped>
.select {
  .label {
    color: #808088;
    line-height: 24px;
  }
}
</style>

<style lang="scss">
.el-select__wrapper {
  border-radius: 8px;
  background-color: #f6f6f7;
  border: 1px;
  border-color: #eaeaeb;
}
</style>

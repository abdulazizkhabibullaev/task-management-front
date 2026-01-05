<template>
  <div class="filter-field">
    <label class="field-label">{{ label }}</label>
    <slot>
      <!-- Default select component -->
      <el-select
        v-if="type === 'select'"
        v-model="localValue"
        :placeholder="placeholder || $t('COMMON.SELECT')"
        :multiple="multiple"
        :clearable="clearable"
        :filterable="filterable"
        :collapse-tags="collapseTags"
        :collapse-tags-tooltip="collapseTagsTooltip"
        class="field-select"
        @change="handleChange"
      >
        <el-option
          v-for="item in options"
          :key="getOptionValue(item)"
          :label="getOptionLabel(item)"
          :value="getOptionValue(item)"
        />
      </el-select>

      <!-- Input component -->
      <el-input
        v-else-if="type === 'input'"
        v-model="localValue"
        :placeholder="placeholder"
        clearable
        class="field-input"
        @input="handleChange"
      />

      <!-- Date picker -->
      <el-date-picker
        v-else-if="type === 'date'"
        v-model="localValue"
        :type="dateType"
        :placeholder="placeholder"
        :start-placeholder="startPlaceholder"
        :end-placeholder="endPlaceholder"
        :format="dateFormat"
        :value-format="dateValueFormat"
        class="field-date"
        @change="handleChange"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { $t } from '@/plugins/i18n';

interface Props {
  label: string;
  modelValue?: any;
  type?: 'select' | 'input' | 'date' | 'custom';
  placeholder?: string;
  options?: any[];
  optionKey?: string;
  optionLabel?: string;
  multiple?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  collapseTags?: boolean;
  collapseTagsTooltip?: boolean;
  // Date specific props
  dateType?: 'date' | 'daterange' | 'datetime' | 'datetimerange';
  dateFormat?: string;
  dateValueFormat?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'select',
  optionKey: 'value',
  optionLabel: 'label',
  multiple: false,
  clearable: true,
  filterable: false,
  collapseTags: true,
  collapseTagsTooltip: true,
  dateType: 'date',
  dateFormat: 'YYYY-MM-DD',
  dateValueFormat: 'YYYY-MM-DD',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'change', value: any): void;
}>();

const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  newVal => {
    localValue.value = newVal;
  },
);

const getOptionValue = (item: any) => {
  if (typeof item === 'object') {
    return item[props.optionKey];
  }
  return item;
};

const getOptionLabel = (item: any) => {
  if (typeof item === 'object') {
    return item[props.optionLabel];
  }
  return item;
};

const handleChange = (val: any) => {
  emit('update:modelValue', val);
  emit('change', val);
};
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.filter-field {
  .field-label {
    display: block;
    font-size: 13px;
    font-weight: 400;
    color: #525c69;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .field-select,
  .field-input,
  .field-date {
    width: 100%;
  }

  :deep(.el-select) {
    width: 100%;

    .el-select__wrapper {
      min-height: 34px;
      border-radius: 3px;
      border-color: #c6cdd3;
      box-shadow: none;

      &:hover {
        border-color: $color-primary;
      }

      &.is-focused {
        border-color: $color-primary;
        box-shadow: 0 0 0 1px rgba($color-primary, 0.2);
      }
    }
  }

  :deep(.el-input) {
    .el-input__wrapper {
      min-height: 34px;
      border-radius: 3px;
      box-shadow: 0 0 0 1px #c6cdd3;

      &:hover {
        box-shadow: 0 0 0 1px $color-primary;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px $color-primary;
      }
    }
  }

  :deep(.el-date-editor) {
    width: 100% !important;

    &.el-input__wrapper {
      min-height: 34px;
      border-radius: 3px;
    }
  }

  // Multi-select tags styling (like Bitrix assignee chips)
  :deep(.el-select__tags) {
    .el-tag {
      background-color: #e6f1fc;
      border: none;
      color: $color-primary;
      border-radius: 3px;
      margin: 2px 4px 2px 0;
      max-width: 100%;

      .el-tag__close {
        color: $color-primary;

        &:hover {
          background-color: $color-primary;
          color: #fff;
        }
      }
    }
  }
}
</style>

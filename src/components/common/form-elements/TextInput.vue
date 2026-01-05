<template>
  <div class="text-input">
    <el-form-item :prop="props.prop" :label="props.label">
      <el-input
        :model-value="form.input"
        :placeholder="props.placeholder"
        :maxlength="props.maxlength"
        :disabled="props.disabled"
        @input="handleInput"
        :type="props.type"
        :show-password="props.type === 'password'"
        @keyup.enter="handleEnterKeyEvent"
        :rows="props.rows"
        autocomplete="new-password"
      />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus';
import { reactive, ref, watch } from 'vue';

const formRef = ref<FormInstance>();

const props = defineProps({
  label: {
    type: String,
  },
  placeholder: {
    type: String,
    required: false,
  },
  maxlength: {
    type: Number,
    default: 256,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  required: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  prop: {
    type: String,
    default: 'input',
  },
  rows: {
    type: Number,
    default: 2,
  },
});

const form = reactive({
  input: props.modelValue,
});

watch(
  () => props.modelValue,
  newValue => (form.input = newValue),
);

const $emit = defineEmits<{
  (e: 'input', val: any): any;
  (e: 'keyup.enter'): void;
}>();

const handleInput = (value: string) => {
  $emit('input', value?.trimStart());
};

const handleEnterKeyEvent = () => {
  $emit('keyup.enter');
};

const resetFields = () => {
  formRef.value?.resetFields();
};

defineExpose({
  resetFields,
});
</script>
<style lang="scss">
.el-input__wrapper {
  border-radius: 8px;
  background-color: #f6f6f7;
  border: 1px;
  border-color: #eaeaeb;
  height: 40px;
}
</style>

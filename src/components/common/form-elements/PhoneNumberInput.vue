<template>
  <el-form-item prop="login" :label="$t('FORMS.PHONE_NUMBER')">
    <el-input
      :model-value="form.input"
      @input="handleInput"
      :placeholder="'+998 90 123 45 67'"
      :formatter="formatPhoneNumber"
      type="tel"
      :disabled="props.disabled"
    >
    </el-input>
  </el-form-item>
</template>
<script lang="ts" setup>
import { $t } from '@/plugins/i18n';
import { reactive, watch } from 'vue';

const $emit = defineEmits<{
  (e: 'input', val: string): void;
}>();

const props = defineProps({
  value: {
    type: String,
    default: '+998',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const form = reactive({
  input: '+998',
});

watch(
  () => props.value,
  val => {
    form.input = val;
  },
);
const handleInput = (val: string) => {
  $emit('input', val);
};

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '');

  const match = digits.match(/^(\d{1,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  if (!match) return value;

  const formatted = `+${match[1]}${match[2] ? ` ${match[2]}` : ''}${match[3] ? ` ${match[3]}` : ''}${
    match[4] ? ` ${match[4]}` : ''
  }${match[5] ? ` ${match[5]}` : ''}`;

  return formatted;
}
</script>

<style scoped lang="scss">
.label {
  color: #808088;
  line-height: 24px;
}
</style>
<style scoped lang="scss">
.el-select__suffix {
  display: none;
}
</style>

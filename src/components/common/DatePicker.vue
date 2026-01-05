<template>
  <el-date-picker
    v-model="selectedDate"
    :type="props.type"
    :disabled-date="isDateDisabled"
    :disabled="props.disabled"
    :format="props.format"
    @change="handleChange"
    :clearable="clearable"
    style="width: auto"
  >
  </el-date-picker>
</template>

<script lang="ts" setup>
import { dayjs } from 'element-plus';
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  format: {
    type: String,
    default: 'DD.MM.YYYY',
  },
  type: {
    type: String,
    default: 'date',
  },
  disabledDate: {
    type: Function,
    required: false,
  },
  minToday: {
    type: Boolean,
    default: false,
  },
  maxToday: {
    type: Boolean,
    default: false,
  },
});
const selectedDate = ref(props.modelValue);
watch(
  () => props.modelValue,
  val => {
    selectedDate.value = val;
  },
);
const $emit = defineEmits<{
  (e: 'change', val: any): void;
}>();

const isDateDisabled = (date: Date) => {
  if (typeof props.disabledDate === 'function') return props.disabledDate(date);
  if (props.minToday) return dayjs(new Date()).startOf('day').toDate() > date;
  if (props.maxToday) return dayjs(new Date()).endOf('day').toDate() < date;
  return false;
};

const handleChange = (val: Date) => {
  if (Array.isArray(val) && val.length === 2)
    $emit('change', [
      dayjs(val[0]).startOf('day').toDate(),
      dayjs(val[1]).endOf('day').toDate(),
    ]);
  else $emit('change', val);
};

const setDate = (val: any) => {
  selectedDate.value = val;
};
defineExpose({
  setDate,
});
</script>
<style scoped lang="scss"></style>

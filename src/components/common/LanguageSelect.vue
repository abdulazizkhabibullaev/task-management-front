<template>
  <el-select v-model="selectedValue" @change="onChange" filterable>
    <el-option
      v-for="item in options"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    >
      <span>{{ item.label }}</span>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import myLocalStorage from '@/common/utils/local-storage';
import myCookie from '@/common/utils/my-cookie';
import { $t, i18n } from '@/plugins/i18n';
import { onBeforeMount, ref } from 'vue';

const $emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();

const selectedValue = ref(myCookie.getLang() || myLocalStorage.getLang() || 'uz');
const lang = ref(i18n.global.locale);

const options = ref([
  {
    value: 'uz',
    label: $t('LANGUAGE.UZ'),
  },
  {
    value: 'ru',
    label: $t('LANGUAGE.RU'),
  },
  {
    value: 'en',
    label: $t('LANGUAGE.EN'),
  },
]);
const onChange = (value: 'uz' | 'ru' | 'en') => {
  selectedValue.value = value;
  $emit('update:modelValue', value);
  i18n.global.locale = value;
  lang.value = value;
  myLocalStorage.setLang(value);
  myCookie.setLang(value);
  window.location.reload();
};

onBeforeMount(() => {
  if (!myCookie.getLang()) myCookie.setLang('uz');
  if (!myLocalStorage.getLang()) myLocalStorage.setLang('uz');
});
</script>

<style lang="scss" scoped></style>

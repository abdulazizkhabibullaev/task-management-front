<template>
  <div class="pagination">
    <el-select
      v-model="limit"
      @change="handleSizeChange"
      size="large"
      class="select"
      :class="{ 'hide-on-mobile': isMobile }"
    >
      <el-option
        v-for="number in [10, 20, 50, 100, 200]"
        :key="number"
        :label="String(number)"
        :value="number"
      />
    </el-select>
    <el-pagination
      :current-page="page"
      :page-size="limit"
      @current-change="handleCurrentChange"
      :total="props.total"
      :layout="paginationLayout"
      :small="isMobile"
      popper-class="select"
      background
      class="pagination-component"
    >
    </el-pagination>
  </div>
</template>

<script lang="ts" setup>
import { useResponsive } from '@/composables/useResponsive';
import { computed, onBeforeMount, ref, watch } from 'vue';

const props = defineProps({
  total: { type: Number, required: true },
  page: { type: Number, default: 1 },
  limit: { type: Number, default: 50 },
});
const $emit = defineEmits<{
  (e: 'page-change', key: number): void;
  (e: 'limit-change', key: number): void;
}>();

const { isMobile } = useResponsive();

const page = ref(props.page || 1);
const limit = ref(props.limit || 50);

// Simplified layout for mobile
const paginationLayout = computed(() => {
  if (isMobile.value) return 'prev, pager, next';
  return 'prev, pager, next';
});

const handleSizeChange = (size: number) => {
  limit.value = size;
  $emit('limit-change', size);
};
const handleCurrentChange = (page_number: number) => {
  page.value = page_number;
  $emit('page-change', page_number);
};

watch(
  () => props.page,
  newValue => (page.value = newValue),
);
watch(
  () => props.limit,
  newValue => (limit.value = newValue),
);

onBeforeMount(() => {
  if (!props.page) page.value = 1;
  if (!props.limit) limit.value = 50;
});
</script>
<style scoped lang="scss">
@use '@/assets/scss/breakpoints' as *;
@use '@/assets/scss/variables' as *;

.pagination {
  position: sticky;
  background-color: white;
  height: 52px;
  width: 100%;
  border-radius: 0 0 12px 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 $spacing-md;

  @include mobile {
    height: 44px;
    padding: 0 $spacing-sm;
    justify-content: center;
    gap: $spacing-sm;
  }

  .select {
    width: 80px;

    @include mobile {
      width: 60px;
    }
  }

  .hide-on-mobile {
    @include mobile {
      display: none;
    }
  }

  .pagination-component {
    @include mobile {
      margin-right: 0;
    }
  }
}
</style>
<style lang="scss">
.el-pagination.is-background .el-pager li.is-active {
  border-radius: 8px;
}

@media screen and (max-width: 768px) {
  .el-pagination {
    .el-pager li {
      min-width: 28px;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
    }

    .btn-prev,
    .btn-next {
      min-width: 28px;
      height: 28px;
    }
  }
}
</style>

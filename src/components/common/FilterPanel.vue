<template>
  <div class="filter" :class="{ 'is-open': isOpen }" ref="filterRef">
    <!-- Filter Header Bar -->
    <div class="filter-header" @click="toggleFilter">
      <div class="filter-title">
        <span class="title-text">{{ $t('COMMON.FILTERS') }}</span>
        <span v-if="activeFilterCount > 0" class="filter-count">{{
          activeFilterCount
        }}</span>
        <el-icon class="arrow-icon" :class="{ rotated: isOpen }">
          <ArrowUp />
        </el-icon>
      </div>
      <div class="search-area">
        <el-icon class="search-icon"><Search /></el-icon>
        <input
          ref="searchInputRef"
          type="text"
          v-model="searchValue"
          :placeholder="searchPlaceholder || $t('COMMANDS.SEARCH')"
          class="search-input"
          @click.stop="handleSearchClick"
          @input="handleSearchInput"
          @keyup.enter="handleSearch"
          @focus="handleSearchFocus"
        />
        <el-icon v-if="searchValue" class="clear-icon" @click.stop="handleSearchClear">
          <Close />
        </el-icon>
      </div>
    </div>

    <!-- Filter Body (Dropdown) -->
    <transition name="slide-fade">
      <div v-show="isOpen" class="filter-body">
        <div class="filter-fields">
          <slot></slot>
        </div>
        <div class="filter-footer">
          <el-button type="primary" class="btn-search" @click="handleSearch">
            <el-icon><Search /></el-icon>
            <span>{{ $t('COMMANDS.SEARCH') }}</span>
          </el-button>
          <el-button class="btn-reset" @click="handleReset">
            {{ $t('COMMANDS.RESET') }}
          </el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { $t } from '@/plugins/i18n';
import { Search, ArrowUp, Close } from '@element-plus/icons-vue';

interface Props {
  modelValue?: Record<string, any>;
  search?: string;
  searchPlaceholder?: string;
  defaultExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: false,
  search: '',
});

const emit = defineEmits<{
  (e: 'search', filters: Record<string, any>): void;
  (e: 'reset'): void;
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'update:search', value: string): void;
}>();

const isOpen = ref(props.defaultExpanded);
const searchValue = ref(props.search);
const filterRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const wasOpenBySearchClick = ref(false);

watch(
  () => props.search,
  newVal => {
    searchValue.value = newVal;
  },
);

const activeFilterCount = computed(() => {
  if (!props.modelValue) return 0;
  return Object.values(props.modelValue).filter(val => {
    if (val === null || val === undefined || val === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  }).length;
});

const toggleFilter = () => {
  isOpen.value = !isOpen.value;
  wasOpenBySearchClick.value = false;
};

const handleSearchFocus = () => {
  if (!isOpen.value) {
    isOpen.value = true;
    wasOpenBySearchClick.value = true;
  }
};

const handleSearchClick = () => {
  if (isOpen.value && wasOpenBySearchClick.value) {
    isOpen.value = false;
    wasOpenBySearchClick.value = false;
  } else if (!isOpen.value) {
    isOpen.value = true;
    wasOpenBySearchClick.value = true;
  }
};

const handleSearchInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emit('update:search', value);
};

const handleSearchClear = () => {
  searchValue.value = '';
  emit('update:search', '');
};

const handleSearch = () => {
  emit('search', { ...props.modelValue, search: searchValue.value });
  isOpen.value = false;
};

const handleReset = () => {
  searchValue.value = '';
  emit('update:search', '');
  emit('reset');
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (
    isOpen.value &&
    filterRef.value &&
    !filterRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
    wasOpenBySearchClick.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.filter {
  position: relative;
  margin-bottom: 16px;
  z-index: 100;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;

  .filter-header {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 4px;
    height: 42px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition:
      box-shadow 0.2s,
      border-radius 0.2s;

    .filter-title {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 20px;
      height: 100%;
      border-right: 1px solid #edeef0;
      min-width: 180px;
      user-select: none;

      .title-text {
        font-size: 14px;
        font-weight: 500;
        color: $color-primary;
        white-space: nowrap;
      }

      .filter-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 20px;
        height: 20px;
        padding: 0 6px;
        background: $color-primary;
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        border-radius: 10px;
      }

      .arrow-icon {
        font-size: 14px;
        color: #a8adb4;
        transition: transform 0.25s ease;
        margin-left: 4px;

        &.rotated {
          transform: rotate(180deg);
        }
      }
    }

    .search-area {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 14px;
      height: 100%;
      gap: 10px;

      .search-icon {
        font-size: 16px;
        color: #a8adb4;
        flex-shrink: 0;
      }

      .search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 14px;
        color: #333;
        background: transparent;
        min-width: 0;

        &::placeholder {
          color: #a8adb4;
        }
      }

      .clear-icon {
        font-size: 14px;
        color: #a8adb4;
        cursor: pointer;
        flex-shrink: 0;
        padding: 2px;
        transition: color 0.2s;

        &:hover {
          color: #606266;
        }
      }
    }
  }

  &.is-open .filter-header {
    border-radius: 4px 4px 0 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }

  .filter-body {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow: hidden;

    .filter-fields {
      padding: 20px 20px 16px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }

    .filter-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid #edeef0;
      background: #fafafa;

      .btn-search {
        min-width: 130px;
        height: 38px;
        font-size: 14px;
        font-weight: 500;
        border-radius: 4px;
        background: $color-primary;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;

        &:hover {
          background: darken($color-primary, 8%);
        }
      }

      .btn-reset {
        min-width: 90px;
        height: 38px;
        font-size: 14px;
        border-radius: 4px;
        color: #525c69;
        background: #fff;
        border: 1px solid #c6cdd3;

        &:hover {
          color: $color-primary;
          border-color: $color-primary;
          background: #fff;
        }
      }
    }
  }
}

// Slide transition
.slide-fade-enter-active {
  transition: all 0.25s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

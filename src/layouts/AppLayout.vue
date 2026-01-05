<template>
  <div class="app-layout">
    <el-container v-if="isLoggedIn">
      <!-- Mobile menu overlay -->
      <div
        v-if="isMobile && isSidebarOpen"
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>

      <!-- Sidebar -->
      <el-aside
        :class="[
          'sidebar',
          {
            'sidebar--collapsed': isCollapsed,
            'sidebar--mobile-open': isMobile && isSidebarOpen,
          },
        ]"
        :style="{ width: sidebarWidth }"
      >
        <NavAside :collapsed="isCollapsed" @toggle="toggleCollapse" />
      </el-aside>

      <!-- Main content area -->
      <el-container class="main-container">
        <el-header class="header">
          <Header @toggle-menu="toggleSidebar" />
        </el-header>
        <el-main class="main">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
    <RouterView v-else />
  </div>
</template>

<script setup lang="ts">
import myCookie from '@/common/utils/my-cookie';
import { useResponsive } from '@/composables/useResponsive';
import router from '@/router';
import { useMainStore } from '@/stores/main';
import { computed, onBeforeMount, ref, watch } from 'vue';
import { RouterView } from 'vue-router';
import NavAside from '@/components/layout/Nav-Aside.vue';
import Header from '@/components/layout/Header.vue';

const isLoggedIn = ref(true);
const mainStore = useMainStore();

// Responsive hooks
const { isMobile, isTablet } = useResponsive();
const isSidebarOpen = ref(false);
const isManuallyCollapsed = ref(false);

// Computed for sidebar collapse state
const isCollapsed = computed(() => {
  if (isMobile.value) {
    return !isSidebarOpen.value;
  }
  if (isTablet.value) {
    return true;
  }
  return isManuallyCollapsed.value;
});

const sidebarWidth = computed(() => {
  if (isMobile.value) {
    return isSidebarOpen.value ? '260px' : '0px';
  }
  if (isTablet.value) {
    return '64px';
  }
  return isManuallyCollapsed.value ? '64px' : '260px';
});

// Sidebar controls
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleCollapse = () => {
  if (isMobile.value) {
    isSidebarOpen.value = !isSidebarOpen.value;
  } else {
    isManuallyCollapsed.value = !isManuallyCollapsed.value;
  }
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

// Check authentication and get user data
const checkAuth = () => {
  const token = myCookie.getToken();
  isLoggedIn.value = !!token;

  if (isLoggedIn.value) {
    mainStore.getMe().catch(() => {
      isLoggedIn.value = false;
      router.push({ name: 'login' });
    });
  }
};

// Watch for route changes
watch(
  () => router.currentRoute.value.path,
  () => {
    checkAuth();
    if (isMobile.value) {
      closeSidebar();
    }
  },
);

onBeforeMount(() => {
  checkAuth();
});
</script>

<style scoped lang="scss">
.app-layout {
  min-height: 100vh;
  background: #f5f6fa;
}

.el-container {
  min-height: 100vh;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  transition: all 0.3s;
  overflow: hidden;

  &--mobile-open {
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.main-container {
  flex-direction: column;
  transition: margin-left 0.3s;
}

@media (min-width: 769px) {
  .main-container {
    margin-left: 260px;
  }
  .sidebar--collapsed + .main-container {
    margin-left: 64px;
  }
}

@media (max-width: 768px) {
  .main-container {
    margin-left: 0;
  }
}

.header {
  height: 64px;
  padding: 0;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.main {
  padding: 0;
  background: #f5f6fa;
  overflow-y: auto;
}
</style>

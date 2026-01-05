import { computed, onMounted, onUnmounted, ref } from 'vue';

// Breakpoint values matching SCSS
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * Composable for responsive design utilities
 * Provides reactive breakpoint detection and helper methods
 */
export function useResponsive() {
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 800);

  const updateDimensions = () => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions);
  });

  // Current breakpoint name
  const currentBreakpoint = computed<BreakpointKey>(() => {
    const width = windowWidth.value;
    if (width >= BREAKPOINTS.xxl) return 'xxl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
  });

  // Boolean checks for each breakpoint (mobile-first: is AT or ABOVE breakpoint)
  const isXs = computed(() => windowWidth.value < BREAKPOINTS.sm);
  const isSm = computed(() => windowWidth.value >= BREAKPOINTS.sm);
  const isMd = computed(() => windowWidth.value >= BREAKPOINTS.md);
  const isLg = computed(() => windowWidth.value >= BREAKPOINTS.lg);
  const isXl = computed(() => windowWidth.value >= BREAKPOINTS.xl);
  const isXxl = computed(() => windowWidth.value >= BREAKPOINTS.xxl);

  // Common device type checks
  const isMobile = computed(() => windowWidth.value < BREAKPOINTS.md);
  const isTablet = computed(
    () => windowWidth.value >= BREAKPOINTS.md && windowWidth.value < BREAKPOINTS.lg,
  );
  const isDesktop = computed(() => windowWidth.value >= BREAKPOINTS.lg);

  // Touch device detection
  const isTouchDevice = computed(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  // Helper to check if width is at least a certain breakpoint
  const isBreakpointUp = (breakpoint: BreakpointKey): boolean => {
    return windowWidth.value >= BREAKPOINTS[breakpoint];
  };

  // Helper to check if width is below a certain breakpoint
  const isBreakpointDown = (breakpoint: BreakpointKey): boolean => {
    return windowWidth.value < BREAKPOINTS[breakpoint];
  };

  // Helper to check if width is between two breakpoints
  const isBreakpointBetween = (lower: BreakpointKey, upper: BreakpointKey): boolean => {
    return (
      windowWidth.value >= BREAKPOINTS[lower] && windowWidth.value < BREAKPOINTS[upper]
    );
  };

  // Helper to check if current breakpoint matches exactly
  const isBreakpointOnly = (breakpoint: BreakpointKey): boolean => {
    const breakpointKeys = Object.keys(BREAKPOINTS) as BreakpointKey[];
    const currentIndex = breakpointKeys.indexOf(breakpoint);
    const nextBreakpoint = breakpointKeys[currentIndex + 1];

    if (!nextBreakpoint) {
      return windowWidth.value >= BREAKPOINTS[breakpoint];
    }

    return (
      windowWidth.value >= BREAKPOINTS[breakpoint] &&
      windowWidth.value < BREAKPOINTS[nextBreakpoint]
    );
  };

  // Get responsive value based on current breakpoint
  const getResponsiveValue = <T>(
    values: Partial<Record<BreakpointKey, T>>,
    defaultValue: T,
  ): T => {
    const breakpointKeys: BreakpointKey[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

    for (const bp of breakpointKeys) {
      if (windowWidth.value >= BREAKPOINTS[bp] && values[bp] !== undefined) {
        return values[bp] as T;
      }
    }

    return defaultValue;
  };

  // Responsive grid columns helper
  const gridCols = computed(() => {
    if (isXs.value) return 1;
    if (windowWidth.value < BREAKPOINTS.md) return 2;
    if (windowWidth.value < BREAKPOINTS.lg) return 3;
    if (windowWidth.value < BREAKPOINTS.xl) return 4;
    return 6;
  });

  // Sidebar width based on screen size
  const sidebarWidth = computed(() => {
    if (isMobile.value) return '0px';
    if (isTablet.value) return '64px';
    return '200px';
  });

  // Check if sidebar should be collapsed
  const shouldCollapseSidebar = computed(() => windowWidth.value < BREAKPOINTS.lg);

  return {
    // Dimensions
    windowWidth,
    windowHeight,

    // Current breakpoint
    currentBreakpoint,

    // Breakpoint checks (mobile-first)
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,

    // Device type checks
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,

    // Helper functions
    isBreakpointUp,
    isBreakpointDown,
    isBreakpointBetween,
    isBreakpointOnly,
    getResponsiveValue,

    // Layout helpers
    gridCols,
    sidebarWidth,
    shouldCollapseSidebar,

    // Constants
    BREAKPOINTS,
  };
}

/**
 * Simple hook to get current breakpoint without all the extras
 */
export function useBreakpoint() {
  const { currentBreakpoint, isMobile, isTablet, isDesktop } = useResponsive();
  return { currentBreakpoint, isMobile, isTablet, isDesktop };
}

/**
 * Hook specifically for sidebar responsive behavior
 */
export function useSidebarResponsive() {
  const { isMobile, shouldCollapseSidebar, sidebarWidth } = useResponsive();
  const isOpen = ref(!isMobile.value);

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  return {
    isOpen,
    shouldCollapse: shouldCollapseSidebar,
    sidebarWidth,
    toggle,
    open,
    close,
  };
}

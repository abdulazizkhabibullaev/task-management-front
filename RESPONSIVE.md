# Responsive Design System

This project includes a comprehensive responsive design system that works globally across all components.

## Breakpoints

The system uses the following breakpoints (mobile-first approach):

| Name  | Min Width | Description                          |
| ----- | --------- | ------------------------------------ |
| `xs`  | 0px       | Extra small devices (phones)         |
| `sm`  | 576px     | Small devices (landscape phones)     |
| `md`  | 768px     | Medium devices (tablets)             |
| `lg`  | 992px     | Large devices (desktops)             |
| `xl`  | 1200px    | Extra large devices (large desktops) |
| `xxl` | 1400px    | Extra extra large devices            |

## Using SCSS Mixins

The breakpoints are automatically available in all Vue component `<style>` blocks.

### Basic Usage

```scss
<style lang="scss" scoped>
.my-component {
  padding: 8px;

  // Tablet and up
  @include md {
    padding: 16px;
  }

  // Desktop and up
  @include lg {
    padding: 24px;
  }
}
</style>
```

### Available Mixins

#### Mobile-First (min-width)

```scss
@include xs {
} // 0px and up (essentially always)
@include sm {
} // 576px and up
@include md {
} // 768px and up
@include tablet-up {
} // 768px and up (alias)
@include lg {
} // 992px and up
@include desktop {
} // 992px and up (alias)
@include xl {
} // 1200px and up
@include xxl {
} // 1400px and up
```

#### Desktop-First (max-width)

```scss
@include media-down('md') {
} // Below 768px
@include media-down('lg') {
} // Below 992px
@include mobile {
} // Below 768px (alias)
```

#### Between Breakpoints

```scss
@include media-between('md', 'lg') {
} // 768px to 991px
@include tablet {
} // 768px to 991px (alias)
```

#### Only Specific Breakpoint

```scss
@include media-only('md') {
} // Only tablet range
@include media-only('lg') {
} // Only desktop range
```

## Using Vue Composable

For JavaScript/TypeScript logic, use the `useResponsive` composable:

```vue
<script setup lang="ts">
import { useResponsive } from '@/composables/useResponsive';

const {
  isMobile, // < 768px
  isTablet, // 768px - 991px
  isDesktop, // >= 992px
  currentBreakpoint, // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  windowWidth,
  windowHeight,
} = useResponsive();

// Conditional rendering
const columns = computed(() => (isMobile.value ? 1 : 3));
</script>

<template>
  <div v-if="isMobile">Mobile View</div>
  <div v-else>Desktop View</div>
</template>
```

### Available Properties

| Property            | Type                   | Description                     |
| ------------------- | ---------------------- | ------------------------------- |
| `isMobile`          | `ComputedRef<boolean>` | True when width < 768px         |
| `isTablet`          | `ComputedRef<boolean>` | True when 768px ≤ width < 992px |
| `isDesktop`         | `ComputedRef<boolean>` | True when width ≥ 992px         |
| `isXs`              | `ComputedRef<boolean>` | True when width < 576px         |
| `isSm`              | `ComputedRef<boolean>` | True when width ≥ 576px         |
| `isMd`              | `ComputedRef<boolean>` | True when width ≥ 768px         |
| `isLg`              | `ComputedRef<boolean>` | True when width ≥ 992px         |
| `isXl`              | `ComputedRef<boolean>` | True when width ≥ 1200px        |
| `isXxl`             | `ComputedRef<boolean>` | True when width ≥ 1400px        |
| `currentBreakpoint` | `ComputedRef<string>`  | Current breakpoint name         |
| `windowWidth`       | `Ref<number>`          | Current window width            |
| `windowHeight`      | `Ref<number>`          | Current window height           |

### Helper Methods

```typescript
const { isBreakpointUp, isBreakpointDown, isBreakpointBetween, getResponsiveValue } =
  useResponsive();

// Check if at or above a breakpoint
if (isBreakpointUp('md')) {
}

// Check if below a breakpoint
if (isBreakpointDown('lg')) {
}

// Check if between two breakpoints
if (isBreakpointBetween('md', 'xl')) {
}

// Get value based on current breakpoint
const padding = getResponsiveValue(
  {
    xs: 8,
    md: 16,
    lg: 24,
  },
  8,
); // default value
```

## Utility Classes

Global utility classes are available for common responsive patterns:

### Display Utilities

```html
<!-- Hide/Show based on breakpoint -->
<div class="hide-mobile">Hidden on mobile</div>
<div class="hide-desktop">Hidden on desktop</div>
<div class="show-mobile-only">Only visible on mobile</div>
<div class="show-desktop-only">Only visible on desktop</div>

<!-- Responsive display -->
<div class="d-none d-md-block">Hidden on mobile, visible on tablet+</div>
<div class="d-block d-lg-none">Visible until desktop</div>
```

### Flexbox Utilities

```html
<div class="d-flex flex-column flex-md-row gap-3">
  <!-- Column on mobile, row on tablet+ -->
</div>

<div class="justify-center justify-md-between">
  <!-- Centered on mobile, space-between on tablet+ -->
</div>
```

### Spacing Utilities

```html
<!-- Responsive margins -->
<div class="m-2 m-md-4 m-lg-6">Responsive margin</div>

<!-- Responsive padding -->
<div class="p-2 p-md-4 p-lg-6">Responsive padding</div>
```

### Grid Utilities

```html
<div class="d-grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3 gap-4">
  <!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
</div>
```

## CSS Custom Properties

Breakpoint values are also available as CSS custom properties:

```css
:root {
  --breakpoint-xs: 0px;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-xxl: 1400px;

  --sidebar-width: 200px;
  --sidebar-collapsed-width: 64px;
  --header-height: 48px;
}
```

## Element Plus Responsive Overrides

Element Plus components are automatically responsive:

- **Dialogs**: 95% width on mobile
- **Drawers**: 100% width on mobile
- **Tables**: Smaller font and padding on mobile
- **Forms**: Stack vertically on mobile
- **Pagination**: Simplified on mobile

## Best Practices

1. **Mobile-First**: Start with mobile styles, then add complexity for larger screens
2. **Use Semantic Names**: Prefer `isMobile` over `isBreakpointDown('md')`
3. **Avoid Magic Numbers**: Use the defined breakpoint values
4. **Test All Breakpoints**: Check your UI at each breakpoint transition
5. **Use Utility Classes**: For simple responsive patterns, utility classes are faster

## Example Component

```vue
<template>
  <div class="my-card">
    <h2 class="title">{{ title }}</h2>
    <div class="content d-flex flex-column flex-md-row gap-3">
      <slot />
    </div>
    <div class="actions" v-if="!isMobile">
      <button>Desktop Only Action</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResponsive } from '@/composables/useResponsive';

defineProps<{ title: string }>();

const { isMobile } = useResponsive();
</script>

<style lang="scss" scoped>
.my-card {
  padding: $spacing-sm;
  border-radius: $border-radius-md;

  @include md {
    padding: $spacing-md;
  }

  @include lg {
    padding: $spacing-lg;
  }

  .title {
    font-size: 16px;

    @include md {
      font-size: 20px;
    }

    @include lg {
      font-size: 24px;
    }
  }
}
</style>
```

<template>
  <div
    class="bg-antique-bronze/10 rounded animate-pulse"
    :class="classes"
    :style="customStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full' | 'none'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  rounded: 'md',
})

const roundedMap: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

const classes = computed(() => [
  roundedMap[props.rounded],
  props.class,
])

const customStyle = computed(() => ({
  width: props.width,
  height: props.height,
}))
</script>

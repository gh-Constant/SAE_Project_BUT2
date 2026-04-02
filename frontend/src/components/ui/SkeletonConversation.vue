<template>
  <div class="space-y-3">
    <div v-for="i in count" :key="i" class="flex items-center gap-3 p-4 bg-white/40 rounded-lg border border-antique-bronze/10">
      <!-- Avatar -->
      <div class="w-12 h-12 rounded-full skeleton-shimmer flex-shrink-0" />

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="h-5 skeleton-shimmer rounded w-2/5 mb-2" />
        <div class="h-3 skeleton-shimmer rounded w-4/5" />
      </div>

      <!-- Time -->
      <div class="h-3 skeleton-shimmer rounded w-12 flex-shrink-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), { count: 5 })
</script>

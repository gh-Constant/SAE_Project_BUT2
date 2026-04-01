<template>
  <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-md">
    <div class="h-2 skeleton-shimmer w-full" />
    <div class="p-6">
      <!-- Title + badge -->
      <div class="flex justify-between items-start mb-2">
        <div class="h-7 skeleton-shimmer rounded w-3/5" />
        <div class="h-5 skeleton-shimmer rounded w-20" />
      </div>

      <!-- Date -->
      <div class="h-4 skeleton-shimmer rounded w-2/5 mb-4" />

      <!-- Description -->
      <div class="space-y-2 mb-6">
        <div class="h-3 skeleton-shimmer rounded w-full" />
        <div class="h-3 skeleton-shimmer rounded w-5/6" />
        <div class="h-3 skeleton-shimmer rounded w-3/4" />
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center pt-4 border-t border-antique-bronze/10">
        <div class="h-5 skeleton-shimmer rounded w-24" />
        <div class="h-4 skeleton-shimmer rounded w-20" />
      </div>
    </div>
  </div>
</template>

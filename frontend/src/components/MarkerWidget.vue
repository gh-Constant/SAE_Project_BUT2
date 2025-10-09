<script setup lang="ts">
interface MarkerWidgetProps {
  title: string;
  bannerImage: string;
  owner?: string;
  type: string;
  cost?: string | number;
  purchased?: boolean;
  description: string;
  additionalImages?: string[];
}

defineProps<MarkerWidgetProps>();
const emit = defineEmits<{
  close: []
}>();
</script>

<template>
  <div class="marker-widget bg-white rounded-lg shadow-lg max-w-2xl mx-auto overflow-hidden">
    <!-- Banner Image -->
    <div class="w-full h-64 relative">
      <img
        :src="bannerImage"
        :alt="title"
        class="w-full h-full object-cover"
      >
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Title -->
      <h2 class="text-3xl font-bold text-gray-900 mb-6">
        {{ title }}
      </h2>

      <!-- Info Grid -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="info-item">
          <span class="font-semibold text-gray-700">Owner:</span>
          <span class="text-gray-600">{{ owner || '---' }}</span>
        </div>
        <div class="info-item text-right">
          <span class="font-semibold text-gray-700">Cost:</span>
          <span class="text-gray-600">{{ cost || '---' }}</span>
        </div>
        <div class="info-item">
          <span class="font-semibold text-gray-700">Type:</span>
          <span class="text-gray-600">{{ type }}</span>
        </div>
        <div class="info-item text-right">
          <span class="font-semibold text-gray-700">Purchased:</span>
          <span class="text-gray-600">{{ purchased ? 'Yes' : 'No' }}</span>
        </div>
      </div>

      <!-- Description -->
      <div class="prose max-w-none">
        <p class="text-gray-700 text-lg leading-relaxed">
          {{ description }}
        </p>
      </div>

      <!-- Additional Images -->
      <div
        v-if="additionalImages?.length"
        class="mt-6 grid grid-cols-2 gap-4"
      >
        <div
          v-for="(image, index) in additionalImages"
          :key="index"
          class="rounded-lg overflow-hidden h-48"
        >
          <img
            :src="image"
            :alt="`Additional image ${index + 1}`"
            class="w-full h-full object-cover"
          >
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 bg-gray-50 flex justify-end">
      <button
        class="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        @click="emit('close')"
      >
        Close
      </button>
    </div>
  </div>
</template>

<style scoped>
.info-item {
  @apply flex justify-between items-center;
}
</style>

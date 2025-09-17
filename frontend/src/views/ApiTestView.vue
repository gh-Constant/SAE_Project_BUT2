<script setup lang="ts">
import { ref, onMounted } from 'vue';

const message = ref<string>('Loading...');
const error = ref<string>('');

onMounted(async () => {
  if (import.meta.env.VITE_NO_BACKEND === 'true') {
    error.value = 'failed to connect : mode = nobackend';
    return;
  }
  try {
    const apiUrl = import.meta.env.DEV ? 'http://localhost:3000/' : 'http://api.minecraft.constantsuchet.fr/';
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    message.value = data.message || 'No message received';
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred';
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">API Test</h1>
    <div v-if="error" class="text-red-500">
      Error: {{ error }}
    </div>
    <div v-else class="text-green-500">
      Backend Response: {{ message }}
    </div>
  </div>
</template>
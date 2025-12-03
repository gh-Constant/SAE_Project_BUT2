import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const isWidgetOpen = ref(false);

  function setWidgetOpen(isOpen: boolean) {
    isWidgetOpen.value = isOpen;
  }

  return {
    isWidgetOpen,
    setWidgetOpen
  };
});

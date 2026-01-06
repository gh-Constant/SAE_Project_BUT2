import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
    // Global Festival Dates
    // In a real app, these would be fetched from a backend 'settings' endpoint
    const festival_start_date = ref<string | null>('2026-06-20'); // Default mock values
    const festival_end_date = ref<string | null>('2026-07-05');

    const setFestivalDates = (start: string | null, end: string | null) => {
        festival_start_date.value = start;
        festival_end_date.value = end;
    };

    return {
        festival_start_date,
        festival_end_date,
        setFestivalDates
    };
});

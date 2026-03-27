<script setup lang="ts">
import { computed } from 'vue';
import { useNotificationStore, type AppNotification } from '@/stores/notifications';

const notificationStore = useNotificationStore();

const notifications = computed(() => notificationStore.notifications);

const iconByType: Record<AppNotification['type'], string> = {
  success: 'fas fa-check-circle',
  error: 'fas fa-times-circle',
  info: 'fas fa-info-circle'
};

const cardClassByType: Record<AppNotification['type'], string> = {
  success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
  error: 'bg-red-50 border-red-300 text-red-900',
  info: 'bg-sky-50 border-sky-300 text-sky-900'
};

const iconClassByType: Record<AppNotification['type'], string> = {
  success: 'text-emerald-600',
  error: 'text-red-600',
  info: 'text-sky-600'
};
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[12000] pointer-events-none w-[92vw] max-w-sm">
      <TransitionGroup
        name="toast"
        tag="div"
        class="space-y-3"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto rounded-md border shadow-lg backdrop-blur-sm px-4 py-3 text-left"
          :class="cardClassByType[notification.type]"
        >
          <div class="flex items-start gap-3">
            <i :class="[iconByType[notification.type], iconClassByType[notification.type], 'mt-0.5 text-lg']"></i>
            <div class="min-w-0 flex-1">
              <p class="font-bold leading-tight">{{ notification.title }}</p>
              <p v-if="notification.message" class="text-sm mt-1 leading-snug opacity-90">{{ notification.message }}</p>
            </div>
            <button
              class="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              @click="notificationStore.removeNotification(notification.id)"
              aria-label="Close notification"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.22s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px) translateX(16px);
}
</style>
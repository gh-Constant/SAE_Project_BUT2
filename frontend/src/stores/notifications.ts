import { defineStore } from 'pinia';
import { ref } from 'vue';

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message?: string;
  duration: number;
}

interface AddNotificationPayload {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

const DEFAULT_DURATION = 3500;

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<AppNotification[]>([]);

  const removeNotification = (id: number) => {
    notifications.value = notifications.value.filter(notification => notification.id !== id);
  };

  const addNotification = (payload: AddNotificationPayload) => {
    const id = Date.now() + Math.floor(Math.random() * 10000);
    const duration = payload.duration ?? DEFAULT_DURATION;

    notifications.value.push({
      id,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      duration
    });

    if (duration > 0) {
      window.setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const success = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'success', title, message, duration });
  };

  const error = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'error', title, message, duration });
  };

  const info = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'info', title, message, duration });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info
  };
});
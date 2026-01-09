<template>
  <div class="contact-section" v-if="authStore.isAuthenticated">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold text-gray-800">{{ t('widgets.contact.title') || 'Contact Us' }}</h3>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong class="font-bold">{{ t('widgets.contact.success_title') || 'Success!' }}</strong>
      <span class="block sm:inline">{{ successMessage }}</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="successMessage = ''">
        <svg class="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
      </span>
    </div>

    <form @submit.prevent="sendMessage" class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="message">
          {{ t('widgets.contact.message_label') || 'Message' }}
        </label>
        <textarea
          v-model="formData.message"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-antique-bronze focus:border-transparent h-32"
          id="message"
          :placeholder="t('widgets.contact.message_placeholder') || 'Your message here...'"
          required
        ></textarea>
      </div>
      <div class="flex items-center justify-end">
        <button
          class="bg-antique-bronze hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center gap-2"
          type="submit"
          :disabled="isSending"
        >
          <i v-if="isSending" class="fas fa-spinner fa-spin"></i>
          {{ isSending ? (t('widgets.contact.sending_button') || 'Sending...') : (t('widgets.contact.send_button') || 'Send Message') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { messagingService } from '@/services/messagingService';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n();
const authStore = useAuthStore();

const props = defineProps<{
  locationId: number;
}>();

const formData = reactive({
  name: '',
  email: '',
  message: ''
});

const isSending = ref(false);
const successMessage = ref('');

// Helper to fill form data from user
const fillUserData = () => {
  if (authStore.user) {
    formData.name = `${authStore.user.firstname} ${authStore.user.lastname}`;
    formData.email = authStore.user.email;
  }
};

onMounted(() => {
  fillUserData();
});

watch(() => authStore.user, () => {
  fillUserData();
});

const sendMessage = async () => {
  isSending.value = true;
  successMessage.value = '';

  try {
    // Check if conversation exists or create one
    let conversation = (await messagingService.getConversations()).find(c => c.location.id_location === props.locationId);
    
    // If not found (in real usage we might want an easier way to find by location w/o fetching all)
    // But for now, createConversation handles "find or create" logic in backend usually, 
    // or we just call createConversation which returns the conv.
    if (!conversation) {
      conversation = await messagingService.createConversation(props.locationId);
    }
    
    if (conversation) {
      await messagingService.sendMessage(conversation.id_conversation, formData.message);
    }

    successMessage.value = t('widgets.contact.success_message') || 'Message sent successfully! We will get back to you soon.';
    formData.message = '';
    // Don't clear name/email if user is logged in
    fillUserData(); 
    
  } catch (error) {
    console.error('Failed to send message:', error);
    alert(t('widgets.contact.error_message') || 'Failed to send message. Please try again.');
  } finally {
    isSending.value = false;
  }
};
</script>

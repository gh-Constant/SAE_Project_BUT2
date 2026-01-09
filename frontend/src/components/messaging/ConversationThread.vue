<template>
  <div class="flex flex-col h-full bg-white rounded-lg shadow-sm border border-antique-bronze/20 overflow-hidden">
    <!-- Header -->
    <div class="bg-antique-bronze/10 p-4 border-b border-antique-bronze/20 flex justify-between items-center">
      <div v-if="conversation">
        <h3 class="font-medieval font-bold text-lg text-iron-black pointer-events-none select-none">
          {{ isProviderView ? conversation.user?.firstname + ' ' + conversation.user?.lastname : conversation.location.name }}
        </h3>
        <p class="text-xs text-stone-grey" v-if="!isProviderView">
          <span v-if="conversation.location.prestataire">
            {{ conversation.location.prestataire.firstname }} {{ conversation.location.prestataire.lastname }}
          </span>
          <span v-else>
            {{ t('widgets.purchased.owner_label') }}
          </span>
        </p>
      </div>
      <div v-else class="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 flex flex-col" ref="messagesContainer">
      <div v-if="loadingMessages" class="flex justify-center p-4">
        <i class="fas fa-spinner fa-spin text-antique-bronze text-2xl"></i>
      </div>
      
      <div v-else-if="messages.length === 0" class="text-center text-stone-grey py-8 italic">
        {{ t('messaging.no_messages') || 'No messages yet. Start the conversation!' }}
      </div>

      <template v-else>
        <div 
          v-for="msg in messages" 
          :key="msg.id_message" 
          class="flex flex-col max-w-[80%]"
          :class="isMyMessage(msg) ? 'self-end items-end' : 'self-start items-start'"
        >
          <div 
            class="px-4 py-2 rounded-lg shadow-sm text-sm"
            :class="isMyMessage(msg) ? 'bg-antique-bronze text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'"
          >
            {{ msg.content }}
          </div>
          <span class="text-[10px] text-stone-grey mt-1 px-1">
            {{ new Date(msg.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) }}
          </span>
        </div>
      </template>
    </div>

    <!-- Input Area -->
    <div class="p-3 bg-white border-t border-antique-bronze/20">
      <form @submit.prevent="sendMessage" class="flex gap-2">
        <input 
          v-model="newMessage" 
          type="text" 
          class="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-antique-bronze focus:ring-1 focus:ring-antique-bronze transition-colors"
          :placeholder="t('messaging.type_placeholder') || 'Type a message...'"
          :disabled="sending"
        >
        <button 
          type="submit" 
          class="bg-antique-bronze hover:brightness-110 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!newMessage.trim() || sending"
        >
          <i v-if="sending" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { messagingService, type Conversation, type Message } from '@/services/messagingService';

const props = defineProps<{
  conversationId: number;
  initialConversation?: Conversation;
  isProviderView?: boolean;
}>();

const { t } = useI18n();
const authStore = useAuthStore();

const messages = ref<Message[]>([]);
const conversation = ref<Conversation | undefined>(props.initialConversation);
const newMessage = ref('');
const loadingMessages = ref(false);
const sending = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const isMyMessage = (msg: Message) => {
  return msg.sender.id_user === authStore.user?.id;
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const fetchMessages = async () => {
  if (!props.conversationId) return;
  
  loadingMessages.value = true;
  try {
    messages.value = await messagingService.getMessages(props.conversationId);
    await scrollToBottom();
  } catch (error) {
    console.error('Error fetching messages:', error);
  } finally {
    loadingMessages.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  sending.value = true;
  try {
    const sentMsg = await messagingService.sendMessage(props.conversationId, newMessage.value);
    messages.value.push(sentMsg);
    newMessage.value = '';
    await scrollToBottom();
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    sending.value = false;
  }
};

// Fetch messages when conversationId changes
watch(() => props.conversationId, (newId) => {
  if (newId) {
    fetchMessages();
  }
}, { immediate: true });

// Update local conversation if prop changes
watch(() => props.initialConversation, (newConv) => {
  if (newConv) {
    conversation.value = newConv;
  }
});
</script>

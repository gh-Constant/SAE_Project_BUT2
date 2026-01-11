<template>
  <div class="container mx-auto px-4 py-8 h-[calc(100vh-80px)]">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden h-full flex border border-antique-bronze/20">
      
      <!-- Conversations List (Left Side) -->
      <div class="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
        <div class="p-4 bg-antique-bronze/10 border-b border-antique-bronze/20">
          <h2 class="text-xl font-medieval font-bold text-iron-black">{{ t('messaging.title') || 'Messages' }}</h2>
        </div>
        
        <div class="flex-1 overflow-y-auto">
          <div v-if="loadingConversations" class="p-4 text-center">
            <i class="fas fa-spinner fa-spin text-antique-bronze"></i>
          </div>
          
          <div v-else-if="conversations.length === 0" class="p-6 text-center text-stone-grey">
            {{ t('messaging.no_conversations') || 'No conversations yet.' }}
          </div>

          <ul v-else class="divide-y divide-gray-200">
            <li 
              v-for="conv in conversations" 
              :key="conv.id_conversation"
              @click="selectConversation(conv)"
              class="p-4 hover:bg-white cursor-pointer transition-colors border-l-4"
              :class="selectedConversation?.id_conversation === conv.id_conversation ? 'bg-white border-l-antique-bronze shadow-sm' : 'border-l-transparent bg-transparent'"
            >
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-bold text-gray-800 text-sm truncate pr-2">
                   {{ conv.location.name }}
                </h3>
                <div class="flex flex-col items-end">
                  <button 
                    @click.stop="deleteConversation(conv.id_conversation)"
                    class="text-gray-400 hover:text-red-500 transition-colors p-1 mb-1"
                    :title="t('messaging.delete') || 'Delete'"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                  <span class="text-[10px] text-gray-500 whitespace-nowrap">
                    {{ new Date(conv.updated_at).toLocaleDateString() }}
                  </span>
                </div>
              </div>
              <p class="text-xs text-gray-500 truncate">
                {{ conv.messages?.[0]?.content || 'Start chatting...' }}
              </p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Conversation Thread (Right Side) -->
      <div class="flex-1 bg-gray-100 p-4 flex flex-col items-center justify-center relative">
        <div v-if="!selectedConversation" class="text-center text-gray-400">
          <i class="fas fa-comments text-4xl mb-2"></i>
          <p>{{ t('messaging.select_conversation') || 'Select a conversation to start messaging' }}</p>
        </div>

        <ConversationThread 
          v-else 
          :conversation-id="selectedConversation.id_conversation" 
          :initial-conversation="selectedConversation"
          class="w-full h-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ConversationThread from '@/components/messaging/ConversationThread.vue';
import { messagingService, type Conversation } from '@/services/messagingService';

const { t } = useI18n();
const conversations = ref<Conversation[]>([]);
const selectedConversation = ref<Conversation | null>(null);
const loadingConversations = ref(true);

const fetchConversations = async () => {
  loadingConversations.value = true;
  try {
    conversations.value = await messagingService.getConversations();
  } catch (error) {
    console.error('Error fetching conversations:', error);
  } finally {
    loadingConversations.value = false;
  }
};

const selectConversation = (conv: Conversation) => {
  selectedConversation.value = conv;
};

const deleteConversation = async (id: number) => {
  if (confirm(t('messaging.confirm_delete') || 'Are you sure?')) {
    try {
      await messagingService.deleteConversation(id);
      conversations.value = conversations.value.filter(c => c.id_conversation !== id);
      if (selectedConversation.value?.id_conversation === id) {
        selectedConversation.value = null;
      }
    } catch (e) {
      console.error('Failed to delete:', e);
    }
  }
};

onMounted(() => {
  fetchConversations();
});
</script>

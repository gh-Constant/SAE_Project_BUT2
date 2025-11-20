<!--
  @file PrestatairePurchasedWidget.vue
  @description
  Composant widget pour afficher les informations des locations prestataires déjà achetées.
  Montre le profil du prestataire propriétaire, les options d'interaction, et la gestion des blogs.

  @utilité
  - Affiche l'image de bannière et les informations de base de la location
  - Présente le profil du prestataire propriétaire avec avatar et informations
  - Fournit un accès direct au profil du prestataire
  - Permet la création, modification et suppression de blogs pour la location

  @props
  - location: LocationMock - Les données de la location prestataire achetée

  @events
  - close: Émis quand l'utilisateur ferme le widget

  @dépendances
  - LocationMock, USERS, PRESTATAIRE_TYPES: Données mock
  - useAuthStore: Pour vérifier le rôle de l'utilisateur
  - Editor: Composant d'édition de texte riche
-->
<template>
  <div class="min-h-96">
    <div class="relative w-full h-48 overflow-hidden rounded-t-lg">
      <img :src="location.banner_image" :alt="location.name" class="w-full h-full object-cover" />
    </div>

    <div class="p-5">
      <h2 class="text-2xl font-bold mb-3 text-gray-800">{{ location.name }}</h2>
      <p class="text-base leading-relaxed text-gray-600 mb-5">{{ location.description }}</p>

      <!-- Prestataire Profile Section -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5" v-if="prestataire">
        <div class="flex items-center mb-3">
          <img :src="prestataire.avatar_url" :alt="prestataire.firstname" class="w-12 h-12 rounded-full mr-3 border-2 border-gray-300" />
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-800">{{ prestataire.firstname }} {{ prestataire.lastname }}</h3>
            <p class="text-sm text-gray-600">{{ prestataireTypeName }}</p>
          </div>
        </div>
        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors" @click="viewProfile">
          View Profile
        </button>
      </div>

      <!-- Blogs Section -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5" v-if="isOwner">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Blogs</h3>
        
        <!-- Blog List -->
        <div v-if="!showEditor && blogs.length > 0" class="space-y-2 mb-3">
          <div v-for="blog in blogs" :key="blog.id_blog" class="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
            <div class="flex-1">
              <h4 class="font-medium text-gray-800">{{ blog.title }}</h4>
              <p class="text-sm text-gray-500">{{ formatDate(blog.created_at) }}</p>
            </div>
            <div class="flex gap-2">
              <button @click="editBlog(blog)" class="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
                Edit
              </button>
              <button @click="deleteBlog(blog.id_blog)" class="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>

        <div v-if="!showEditor && blogs.length === 0" class="text-gray-500 text-sm mb-3">
          No blogs yet. Create your first blog!
        </div>

        <!-- Blog Editor -->
        <div v-if="showEditor" class="mb-3">
          <input
            v-model="currentBlog.title"
            type="text"
            placeholder="Blog Title"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Editor ref="editorRef" :initialContent="currentBlog.content" />
          <div class="flex gap-2 mt-2">
            <button @click="saveBlog" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
              {{ currentBlog.id_blog ? 'Update' : 'Create' }} Blog
            </button>
            <button @click="cancelEdit" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>

        <!-- Create Blog Button -->
        <button v-if="!showEditor" @click="createNewBlog" class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Create New Blog
        </button>
      </div>

      <!-- Blogs Display for Non-Owners -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5" v-if="!isOwner && blogs.length > 0">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Blogs</h3>
        <div class="space-y-3">
          <div v-for="blog in blogs" :key="blog.id_blog" class="p-3 bg-white rounded border border-gray-200">
            <h4 class="font-medium text-gray-800 mb-1">{{ blog.title }}</h4>
            <p class="text-sm text-gray-500 mb-2">{{ formatDate(blog.created_at) }}</p>
            <div class="prose prose-sm" v-html="blog.content"></div>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
        <div class="flex justify-between mb-2">
          <span class="font-semibold text-gray-700">Location:</span>
          <span class="text-gray-600">{{ location.static_code }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-semibold text-gray-700">Status:</span>
          <span class="text-green-600 font-semibold">Purchased</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold text-gray-700">Price:</span>
          <span class="text-green-600 font-semibold">{{ location.price }} gold</span>
        </div>
      </div>

      <div class="flex gap-3 justify-end">
        <button class="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors" @click="$emit('close')">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Script du composant PrestatairePurchasedWidget
 * Gère l'affichage des locations prestataires achetées et la gestion des blogs
 */

import { defineProps, defineEmits, computed, ref, onMounted } from 'vue';
import { LocationMock } from '@/mocks/locations';
import { USERS } from '@/mocks/users';
import { PRESTATAIRE_TYPES } from '@/mocks/prestataireTypes';
import Editor from '@/components/editor/Editor.vue';

interface Blog {
  id_blog?: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  id_location: number;
}

interface Props {
  location: LocationMock;
}

const props = defineProps<Props>();

defineEmits<{
  close: [];
}>();

const prestataire = computed(() => {
  return USERS.find(user => user.id === props.location.id_prestataire);
});

const prestataireTypeName = computed(() => {
  if (!prestataire.value?.id_prestataire_type) return '';
  const type = PRESTATAIRE_TYPES.find(t => t.id === prestataire.value?.id_prestataire_type);
  return type?.name || '';
});

// Blog management
const blogs = ref<Blog[]>([]);
const showEditor = ref(false);
const currentBlog = ref<Blog>({
  title: '',
  content: '',
  id_location: props.location.id
});
const editorRef = ref<InstanceType<typeof Editor> | null>(null);

// Check if current user is the owner
const isOwner = computed(() => {
  // TODO: Replace with actual auth check
  // For now, assuming user is owner if location has a prestataire
  return props.location.id_prestataire !== null;
});

const viewProfile = () => {
  // TODO: Naviguer vers le profil du prestataire
  console.log('Affichage du profil de:', prestataire.value?.firstname);
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const fetchBlogs = async () => {
  try {
    const response = await fetch(`/api/v1/blogs/locations/${props.location.id}/blogs`);
    if (response.ok) {
      blogs.value = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
  }
};

const createNewBlog = () => {
  currentBlog.value = {
    title: '',
    content: '<p>Start writing your blog...</p>',
    id_location: props.location.id
  };
  showEditor.value = true;
};

const editBlog = (blog: Blog) => {
  currentBlog.value = { ...blog };
  showEditor.value = true;
};

const saveBlog = async () => {
  if (!currentBlog.value.title.trim()) {
    alert('Please enter a blog title');
    return;
  }

  const content = editorRef.value?.getHTML() || '';
  
  try {
    const url = currentBlog.value.id_blog 
      ? `/api/v1/blogs/${currentBlog.value.id_blog}`
      : '/api/v1/blogs';
    
    const method = currentBlog.value.id_blog ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // TODO: Use proper auth store
      },
      body: JSON.stringify({
        title: currentBlog.value.title,
        content,
        id_location: props.location.id
      })
    });

    if (response.ok) {
      await fetchBlogs();
      cancelEdit();
    } else {
      const error = await response.json();
      alert(`Failed to save blog: ${error.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Failed to save blog:', error);
    alert('Failed to save blog');
  }
};

const deleteBlog = async (blogId: number) => {
  if (!confirm('Are you sure you want to delete this blog?')) {
    return;
  }

  try {
    const response = await fetch(`/api/v1/blogs/${blogId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // TODO: Use proper auth store
      }
    });

    if (response.ok) {
      await fetchBlogs();
    } else {
      alert('Failed to delete blog');
    }
  } catch (error) {
    console.error('Failed to delete blog:', error);
    alert('Failed to delete blog');
  }
};

const cancelEdit = () => {
  showEditor.value = false;
  currentBlog.value = {
    title: '',
    content: '',
    id_location: props.location.id
  };
};

onMounted(() => {
  fetchBlogs();
});

</script>

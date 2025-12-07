<!--
  @file BlogSection.vue
  @description
  Composant pour gérer l'affichage et l'édition des blogs pour une location.
  Permet aux propriétaires de créer, modifier et supprimer des articles de blog.
  Affiche les articles avec le style de l'éditeur mais sans l'interface d'édition.

  @props
  - locationId: number - L'ID de la location associée
  - isOwner: boolean - Si l'utilisateur actuel est le propriétaire (peut éditer)
-->
<template>
  <div class="blog-section">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold text-gray-800">{{ t('widgets.blog.title') }}</h3>
      <button 
        v-if="isOwner && !showEditor" 
        @click="createNewBlog" 
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm flex items-center"
      >
        <i class="fas fa-plus mr-2"></i> {{ t('widgets.blog.new_button') }}
      </button>
    </div>

    <!-- Editor Mode -->
    <div v-if="showEditor" class="bg-white border border-gray-200 rounded-lg p-4 mb-5 shadow-sm">
      <h4 class="text-lg font-semibold mb-3 text-gray-700">{{ currentBlog.id_blog ? t('widgets.blog.edit_title') : t('widgets.blog.new_title') }}</h4>
      <input
        v-model="currentBlog.title"
        type="text"
        :placeholder="t('widgets.blog.title_placeholder')"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
      />
      <Editor ref="editorRef" :initialContent="currentBlog.content" />
      <div class="flex gap-2 mt-4 justify-end">
        <button @click="cancelEdit" class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
          {{ t('widgets.blog.cancel') }}
        </button>
        <button @click="saveBlog" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
          {{ t('widgets.blog.save') }}
        </button>
      </div>
    </div>

    <!-- Blog List Display -->
    <div v-else class="space-y-6">
      <div v-if="blogs.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p class="text-gray-500">{{ t('widgets.blog.empty') }}</p>
        <p v-if="isOwner" class="text-sm text-gray-400 mt-1">{{ t('widgets.blog.empty_owner') }}</p>
      </div>

      <div v-for="blog in blogs" :key="blog.id_blog" class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <!-- Blog Header -->
        <div class="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h4 class="text-lg font-bold text-gray-900 leading-tight">{{ blog.title }}</h4>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(blog.created_at) }}</p>
          </div>
          
          <!-- Owner Actions -->
          <div v-if="isOwner" class="flex gap-1 ml-4">
            <button @click="editBlog(blog)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteBlog(blog.id_blog!)" class="p-1.5 text-red-600 hover:bg-red-50 rounded hover:bg-red-100 transition-colors" title="Delete">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <!-- Blog Content -->
        <div class="p-5">
          <!-- Reusing the same typography classes as the editor for consistent rendering -->
          <div class="tiptap prose prose-sm sm:prose lg:prose lg:prose-lg xl:prose-2xl max-w-none focus:outline-none" v-html="blog.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Editor from '@/components/editor/Editor.vue';
import { blogService, Blog } from '@/services/blogService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Props {
  locationId: number;
  isOwner: boolean;
}

const props = defineProps<Props>();

const blogs = ref<Blog[]>([]);
const showEditor = ref(false);
const currentBlog = ref<Blog>({
  title: '',
  content: '',
  id_location: props.locationId
});
const editorRef = ref<InstanceType<typeof Editor> | null>(null);

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const fetchBlogs = async () => {
  try {
    blogs.value = await blogService.getBlogsByLocationId(props.locationId);
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
  }
};

const createNewBlog = () => {
  currentBlog.value = {
    title: '',
    content: '<p>Start writing your update...</p>',
    id_location: props.locationId
  };
  showEditor.value = true;
};

const editBlog = (blog: Blog) => {
  currentBlog.value = { ...blog };
  showEditor.value = true;
};

const saveBlog = async () => {
  if (!currentBlog.value.title.trim()) {
    alert(t('widgets.blog.alert_title'));
    return;
  }

  const content = editorRef.value?.getHTML() || '';
  const blogData = {
    ...currentBlog.value,
    content
  };
  
  try {
    if (currentBlog.value.id_blog) {
      await blogService.updateBlog(blogData);
    } else {
      await blogService.createBlog(blogData);
    }
    await fetchBlogs();
    cancelEdit();
  } catch (error) {
    console.error('Failed to save blog:', error);
    alert(t('widgets.blog.error_save'));
  }
};

const deleteBlog = async (blogId: number) => {
  if (!confirm(t('widgets.blog.delete_confirm'))) {
    return;
  }

  try {
    await blogService.deleteBlog(blogId);
    await fetchBlogs();
  } catch (error) {
    console.error('Failed to delete blog:', error);
    alert(t('widgets.blog.error_delete'));
  }
};

const cancelEdit = () => {
  showEditor.value = false;
  currentBlog.value = {
    title: '',
    content: '',
    id_location: props.locationId
  };
};

onMounted(() => {
  fetchBlogs();
});
</script>

<style scoped>
@reference "tailwindcss";

/* Ensure the content display matches the editor style */
.tiptap :deep(p) {
  margin-bottom: 0.75em;
}

.tiptap :deep(h1), .tiptap :deep(h2), .tiptap :deep(h3) {
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-weight: 600;
}

.tiptap :deep(ul), .tiptap :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 0.75em;
}

.tiptap :deep(li) {
  margin-bottom: 0.25em;
}
</style>

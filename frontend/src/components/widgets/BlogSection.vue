<template>
  <div class="blog-section">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold text-gray-800">{{ t('widgets.blog.title') }}</h3>
      <button v-if="isOwner && !showEditor" @click="createNewBlog" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm flex items-center">
        <i class="fas fa-plus mr-2"></i> {{ t('widgets.blog.new_button') }}
      </button>
    </div>

    <div v-if="showEditor" class="bg-white border border-gray-200 rounded-lg p-4 mb-5 shadow-sm">
      <h4 class="text-lg font-semibold mb-3 text-gray-700">{{ currentBlog.id_blog ? t('widgets.blog.edit_title') : t('widgets.blog.new_title') }}</h4>
      <input v-model="currentBlog.title" type="text" :placeholder="t('widgets.blog.title_placeholder')" class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg" />
      <div class="flex items-center gap-4 mb-3">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="currentBlog.is_sellable" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <span class="text-sm font-medium text-gray-700">{{ t('widgets.blog.sellable_label') }}</span>
        </label>
        <div v-if="currentBlog.is_sellable" class="flex items-center gap-2">
          <input type="number" v-model="currentBlog.price" min="0" step="1" :placeholder="t('widgets.blog.price_placeholder')" class="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <span class="text-sm text-gray-700">{{ t('widgets.blog.currency') }}</span>
        </div>
      </div>
      <Editor ref="editorRef" :initialContent="currentBlog.content" />
      <div class="flex gap-2 mt-4 justify-end">
        <button @click="cancelEdit" class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">{{ t('widgets.blog.cancel') }}</button>
        <button @click="saveBlog" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">{{ t('widgets.blog.save') }}</button>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div v-if="blogs.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p class="text-gray-500">{{ t('widgets.blog.empty') }}</p>
        <p v-if="isOwner" class="text-sm text-gray-400 mt-1">{{ t('widgets.blog.empty_owner') }}</p>
      </div>

      <div v-for="blog in blogs" :key="blog.id_blog" class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer" @click="handleBlogClick(blog)">
        <div class="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h4 class="text-lg font-bold text-gray-900 leading-tight">{{ blog.title }}</h4>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(blog.created_at) }}</p>
            <div v-if="blog.is_sellable" class="mt-1">
              <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border" :class="blog.is_purchased ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'">
                <i class="fas" :class="blog.is_purchased ? 'fa-unlock' : 'fa-lock'"></i>
                {{ blog.is_purchased ? t('widgets.blog.purchased') : t('widgets.blog.premium_price', { price: blog.price || 0 }) }}
              </span>
            </div>
          </div>
          <div v-if="isOwner" class="flex gap-1 ml-4">
            <button @click.stop="editBlog(blog)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded hover:bg-blue-100 transition-colors" :title="t('widgets.blog.edit_action')"><i class="fas fa-edit"></i></button>
            <button @click.stop="deleteBlog(blog.id_blog!)" class="p-1.5 text-red-600 hover:bg-red-50 rounded hover:bg-red-100 transition-colors" :title="t('widgets.blog.delete_action')"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>

        <div class="p-5 relative" :class="{ 'pb-20': canPurchaseBlog(blog) }">
          <div class="tiptap text-sm text-gray-600 leading-relaxed line-clamp-4 overflow-hidden" v-html="blog.content"></div>
          <div class="mt-4 flex items-center justify-between gap-3">
            <span class="text-sm font-semibold text-antique-bronze">{{ canPurchaseBlog(blog) ? t('widgets.blog.locked') : t('widgets.blog.read') }}</span>
            <span class="text-xs text-gray-500">{{ canPurchaseBlog(blog) ? t('widgets.blog.click_options') : t('widgets.blog.click_open') }}</span>
          </div>
          <div v-if="canPurchaseBlog(blog)" class="absolute bottom-4 right-4">
            <button class="px-4 py-2 bg-antique-bronze hover:brightness-110 text-white font-bold rounded-lg shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed" :disabled="buyingBlogId === blog.id_blog" @click.stop="openPurchaseModal(blog)">
              <span v-if="buyingBlogId === blog.id_blog"><i class="fas fa-spinner fa-spin mr-1"></i> {{ t('widgets.blog.buy_loading') }}</span>
              <span v-else>{{ t('widgets.blog.buy') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="selectedBlog" class="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="closeBlogModal">
        <div class="bg-parchment rounded-lg shadow-2xl border-2 border-antique-bronze/40 w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div class="flex items-start justify-between gap-4 px-6 py-5 border-b border-antique-bronze/15 bg-white/60">
            <div>
              <h4 class="text-2xl font-medieval font-bold text-iron-black">{{ selectedBlog.title }}</h4>
              <p class="text-sm text-stone-grey mt-1">{{ formatDate(selectedBlog.created_at) }}</p>
            </div>
            <button @click="closeBlogModal" class="text-stone-grey hover:text-iron-black transition-colors"><i class="fas fa-times text-xl"></i></button>
          </div>
          <div class="overflow-y-auto max-h-[calc(90vh-88px)] px-6 py-5">
            <div class="tiptap prose prose-sm sm:prose lg:prose lg:prose-lg xl:prose-2xl max-w-none focus:outline-none" v-html="selectedBlog.content"></div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="purchaseCandidate" class="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="closePurchaseModal">
        <div class="bg-parchment rounded-lg shadow-2xl border-2 border-antique-bronze/40 w-full max-w-md p-8 text-center">
          <div class="w-20 h-20 bg-antique-bronze/10 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-antique-bronze/20"><i class="fas fa-scroll text-3xl text-antique-bronze"></i></div>
          <h4 class="text-2xl font-medieval font-bold text-iron-black mb-3">{{ purchaseCandidate.title }}</h4>
          <p class="text-stone-grey font-body mb-2">{{ t('widgets.blog.premium_label') }}</p>
          <p class="text-iron-black font-semibold mb-6">{{ t('widgets.blog.purchase_confirm', { price: purchaseCandidate.price || 0 }) }}</p>
          <div v-if="authStore.isAuthenticated" class="flex flex-col gap-3">
            <button @click="buyBlog(purchaseCandidate)" :disabled="buyingBlogId === purchaseCandidate.id_blog" class="w-full bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-3 px-6 rounded-md shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
              <span v-if="buyingBlogId === purchaseCandidate.id_blog"><i class="fas fa-spinner fa-spin mr-2"></i> {{ t('widgets.blog.buy_loading') }}</span>
              <span v-else>{{ t('widgets.blog.buy_article') }}</span>
            </button>
            <button @click="closePurchaseModal" class="w-full bg-white/80 hover:bg-white text-antique-bronze font-medieval font-bold py-3 px-6 rounded-md border-2 border-antique-bronze/30 hover:border-antique-bronze transition-all duration-200">{{ t('widgets.blog.cancel') }}</button>
          </div>
          <div v-else class="flex flex-col gap-3">
            <p class="text-sm text-stone-grey mb-1">{{ t('widgets.blog.login_to_buy') }}</p>
            <router-link to="/login" class="w-full bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-3 px-6 rounded-md shadow-md transition-all duration-200 flex items-center justify-center gap-2" @click="closePurchaseModal"><i class="fas fa-sign-in-alt"></i>{{ t('auth.login.submit') }}</router-link>
            <router-link to="/register" class="w-full bg-white/80 hover:bg-white text-antique-bronze font-medieval font-bold py-3 px-6 rounded-md border-2 border-antique-bronze/30 hover:border-antique-bronze transition-all duration-200 flex items-center justify-center gap-2" @click="closePurchaseModal"><i class="fas fa-user-plus"></i>{{ t('auth.register.submit') }}</router-link>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Editor from '@/components/editor/Editor.vue'
import { blogService, Blog } from '@/services/blogService'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()

interface Props {
  locationId: number
  isOwner: boolean
}

const props = defineProps<Props>()
const authStore = useAuthStore()

const blogs = ref<Blog[]>([])
const buyingBlogId = ref<number | null>(null)
const selectedBlog = ref<Blog | null>(null)
const purchaseCandidate = ref<Blog | null>(null)
const showEditor = ref(false)
const currentBlog = ref<Blog>({ title: '', content: '', id_location: props.locationId, is_sellable: false, price: 0 })
const editorRef = ref<InstanceType<typeof Editor> | null>(null)

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

const fetchBlogs = async () => {
  try {
    blogs.value = await blogService.getBlogsByLocationId(props.locationId)
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
  }
}

const canPurchaseBlog = (blog: Blog): boolean => !props.isOwner && !!blog.id_blog && !!blog.is_sellable && !blog.is_purchased
const canReadBlog = (blog: Blog): boolean => props.isOwner || !blog.is_sellable || !!blog.is_purchased
const closeBlogModal = () => { selectedBlog.value = null }
const openPurchaseModal = (blog: Blog) => { purchaseCandidate.value = blog }
const closePurchaseModal = () => { purchaseCandidate.value = null }

const handleBlogClick = (blog: Blog) => {
  if (canReadBlog(blog)) {
    selectedBlog.value = blog
    return
  }
  if (canPurchaseBlog(blog)) openPurchaseModal(blog)
}

const buyBlog = async (blog: Blog) => {
  if (!blog.id_blog) return
  try {
    buyingBlogId.value = blog.id_blog
    const result = await blogService.purchaseBlog(blog.id_blog)
    if (authStore.user) {
      authStore.user.gold = result.remainingGold
      authStore.saveUserToStorage()
    }
    await fetchBlogs()
    closePurchaseModal()
    selectedBlog.value = { ...blog, is_purchased: true }
  } catch (error) {
    console.error('Failed to purchase blog:', error)
    alert(error instanceof Error ? error.message : t('widgets.blog.error_purchase'))
  } finally {
    buyingBlogId.value = null
  }
}

const createNewBlog = () => {
  currentBlog.value = { title: '', content: `<p>${t('widgets.blog.editor_placeholder')}</p>`, id_location: props.locationId, is_sellable: false, price: 0 }
  showEditor.value = true
}

const editBlog = (blog: Blog) => {
  currentBlog.value = { ...blog }
  showEditor.value = true
}

const saveBlog = async () => {
  if (!currentBlog.value.title.trim()) {
    alert(t('widgets.blog.alert_title'))
    return
  }
  if (currentBlog.value.is_sellable && (!currentBlog.value.price || currentBlog.value.price <= 0)) {
    alert(t('widgets.blog.error_invalid_price'))
    return
  }
  const content = editorRef.value?.getHTML() || ''
  const blogData = { ...currentBlog.value, content }
  try {
    if (currentBlog.value.id_blog) await blogService.updateBlog(blogData)
    else await blogService.createBlog(blogData)
    await fetchBlogs()
    cancelEdit()
  } catch (error) {
    console.error('Failed to save blog:', error)
    alert(t('widgets.blog.error_save'))
  }
}

const deleteBlog = async (blogId: number) => {
  if (!confirm(t('widgets.blog.delete_confirm'))) return
  try {
    await blogService.deleteBlog(blogId)
    await fetchBlogs()
  } catch (error) {
    console.error('Failed to delete blog:', error)
    alert(t('widgets.blog.error_delete'))
  }
}

const cancelEdit = () => {
  showEditor.value = false
  currentBlog.value = { title: '', content: '', id_location: props.locationId, is_sellable: false, price: 0 }
}

onMounted(() => { fetchBlogs() })
</script>

<style scoped>
@reference "tailwindcss";
.tiptap :deep(p) { margin-bottom: 0.75em; }
.tiptap :deep(h1), .tiptap :deep(h2), .tiptap :deep(h3) { margin-top: 1.5em; margin-bottom: 0.75em; font-weight: 600; }
.tiptap :deep(ul), .tiptap :deep(ol) { padding-left: 1.5em; margin-bottom: 0.75em; }
.tiptap :deep(li) { margin-bottom: 0.25em; }
</style>

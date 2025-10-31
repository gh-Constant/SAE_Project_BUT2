import { defineStore } from 'pinia'
import { ArticleMock } from '@/mocks/article'
import { articleService } from '@/services/articleService'

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: articleService.getArticles(),
    editId: null as number | null,
    editArticle: articleService.defaultArticle()
  }),

  actions: {
    startEdit(article: ArticleMock) {
      this.editId = article.id
      this.editArticle = { ...article }
    },

    saveEdit() {
      if (articleService.updateArticle(this.editArticle)) {
        this.editId = null
      }
    },

    cancelEdit() {
      this.editId = null
    },

    deleteArticle(id: number) {
      articleService.deleteArticle(id)
    }
  }
})

import { defineStore } from 'pinia'
import { ArticleMock } from '@/mocks/article'
import { articleService } from '@/services/articleService'

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: articleService.getArticles(),
    editId: null as number | null,
    editArticle: articleService.defaultArticle(),
    newArticle: articleService.defaultArticle()
  }),

  actions: {
    // Start editing an article
    startEdit(article: ArticleMock) {
      this.editId = article.id
      this.editArticle = {
        id: article.id,
        name: article.name,
        stock: article.stock,
        prestataireId: article.prestataireId,
        description: article.description,
        imageUrl: article.imageUrl,
        price: article.price
      }
    },

    // Save the modifications of an article
    saveEdit() {
      const updatedArticle = articleService.updateArticle(this.editArticle)
      if (updatedArticle) {
        // Update the article in the list
        let position = -1
        for (let i = 0; i < this.articles.length; i++) {
          if (this.articles[i].id === updatedArticle.id) {
            position = i
            break
          }
        }
        if (position !== -1) {
          this.articles[position] = {
            id: updatedArticle.id,
            name: updatedArticle.name,
            stock: updatedArticle.stock,
            prestataireId: updatedArticle.prestataireId,
            description: updatedArticle.description,
            imageUrl: updatedArticle.imageUrl,
            price: updatedArticle.price
          }
        }
        this.editId = null
      }
    },

    // Cancel the modifications of an article
    cancelEdit() {
      this.editId = null
    },

    // Delete an article
    deleteArticle(idArticle: number) {
      if (articleService.deleteArticle(idArticle)) {
        // Remove the article from the list
        const newAllArticles = []
        for (const article of this.articles) {
          if (article.id !== idArticle) {
            newAllArticles.push(article)
          }
        }
        this.articles = newAllArticles
      }
    },

    // Add a new article for a prestataire
    addArticleForPrestataire(idProvider: number) {
      const createdArticle = articleService.createArticleForPrestataire(idProvider, this.newArticle)
      this.articles.push({
        id: createdArticle.id,
        name: createdArticle.name,
        stock: createdArticle.stock,
        prestataireId: createdArticle.prestataireId,
        description: createdArticle.description,
        imageUrl: createdArticle.imageUrl,
        price: createdArticle.price
      })
      this.newArticle = articleService.defaultArticle()
    }
  },

  getters: {
    // Return the articles of a specific provider
    articlesForPrestataire: (state) => (idProvider: number) => {
      const articlesProvider = []
      for (const article of state.articles) {
        if (article.prestataireId === idProvider) {
          articlesProvider.push(article)
        }
      }
      return articlesProvider
    }
  }
})




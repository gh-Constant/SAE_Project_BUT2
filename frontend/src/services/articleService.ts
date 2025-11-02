import { ArticleMock, Articles } from '@/mocks/article'
import { USERS } from '@/mocks/users'

// Crée une copie de la liste des articles pour pouvoir la modifier
const articles: ArticleMock[] = []
for (const article of Articles) {
  const articleCopie = {
    id: article.id,
    name: article.name,
    stock: article.stock,
    prestataireId: article.prestataireId,
    description: article.description,
    imageUrl: article.imageUrl,
    price: article.price
  }
  articles.push(articleCopie)
}

export const articleService = {
  getArticles() {
    return articles
  },

  getPrestataireName(prestataireId: number) {
    for (const user of USERS) {
      if (user.id === prestataireId) {
        return user.firstname + ' ' + user.lastname
      }
    }
    return 'Inconnu'
  },

  deleteArticle(id: number) {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cet article ?')
    if (!confirmation) return false

    const newArticles = []
    for (const article of articles) {
      if (article.id !== id) {
        newArticles.push(article)
      }
    }
    
    // Remplace l'ancienne liste par la nouvelle
    articles.length = 0
    for (const article of newArticles) {
      articles.push(article)
    }
    return true
  },

  updateArticle(articleToUpdate: ArticleMock) {
    const index = articles.findIndex(a => a.id === articleToUpdate.id)
    if (index >= 0) {
      articles[index] = { ...articleToUpdate }
      return articles[index]
    }
    return null
  },

  createArticle(nouvelArticle: {
    name: string,
    stock: number,
    prestataireId: number,
    description: string,
    imageUrl: string,
    price: number
  }) {
    let maxId = 0
    for (const article of articles) {
      if (article.id > maxId) {
        maxId = article.id
      }
    }

    // Créer le nouvel article avec un ID unique
    const articleComplet = {
      id: maxId + 1,
      name: nouvelArticle.name,
      stock: nouvelArticle.stock,
      prestataireId: nouvelArticle.prestataireId,
      description: nouvelArticle.description,
      imageUrl: nouvelArticle.imageUrl,
      price: nouvelArticle.price
    }

    articles.push(articleComplet)
    return articleComplet
  },

  defaultArticle() {
    return {
      id: 0,
      name: '',
      stock: 0,
      prestataireId: 0,
      description: '',
      imageUrl: '',
      price: 0
    }
  },

  // Nouvelles fonctions pour les prestataires
  getArticlesByPrestataire(prestataireId: number) {
    return articles.filter(article => article.prestataireId === prestataireId)
  },

  createArticleForPrestataire(prestataireId: number, articleData: {
    name: string,
    stock: number,
    description: string,
    imageUrl: string,
    price: number
  }) {
    let maxId = 0
    for (const article of articles) {
      if (article.id > maxId) {
        maxId = article.id
      }
    }

    const newArticle = {
      id: maxId + 1,
      prestataireId: prestataireId,
      name: articleData.name,
      stock: articleData.stock,
      description: articleData.description,
      imageUrl: articleData.imageUrl,
      price: articleData.price
    }

    articles.push(Object.assign({}, newArticle))
    return newArticle
  },

  canModifyArticle(articleId: number, prestataireId: number): boolean {
    for (const article of articles) {
      if (article.id === articleId) {
        return article.prestataireId === prestataireId
      }
    }
    return false
  }
}


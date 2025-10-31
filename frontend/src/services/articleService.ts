import { ArticleMock, Articles } from '@/mocks/article'
import { USERS } from '@/mocks/users'

// Copie initiale des articles
const articles = Articles.map(article => Object.assign({}, article))

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
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      const newArticles = []
      for (const article of articles) {
        if (article.id !== id) {
          newArticles.push(article)
        }
      }
      articles.length = 0
      for (const article of newArticles) {
        articles.push(article)
      }
      return true
    }
    return false
  },

  updateArticle(articleToUpdate: ArticleMock) {
    // Chercher l'index de l'article à mettre à jour
    let indexToUpdate = -1
    for (let i = 0; i < articles.length; i++) {
      if (articles[i].id === articleToUpdate.id) {
        indexToUpdate = i
        break
      }
    }

    if (indexToUpdate >= 0) {
      // Créer une copie de l'article avec les nouvelles valeurs
      const updatedArticle = {
        id: articleToUpdate.id,
        name: articleToUpdate.name,
        stock: articleToUpdate.stock,
        prestataireId: articleToUpdate.prestataireId,
        description: articleToUpdate.description,
        imageUrl: articleToUpdate.imageUrl,
        price: articleToUpdate.price
      }
      articles[indexToUpdate] = updatedArticle
      return true
    }
    return false
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
  }
}

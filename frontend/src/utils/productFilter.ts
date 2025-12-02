import type { ProductStoreMock } from '@/services/productService'

export interface ProductFilterOptions {
  searchQuery?: string
  priceMin?: number | null
  priceMax?: number | null
  stockFilter?: 'all' | 'in-stock' | 'out-of-stock'
  sortBy?: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'
}

export function filterAndSortProducts(products: ProductStoreMock[], options: ProductFilterOptions): ProductStoreMock[] {
  let filtered = [...products]

  // Filtre par recherche (nom ou description)
  if (options.searchQuery && options.searchQuery.trim()) {
    const query = options.searchQuery.toLowerCase().trim()
    filtered = filtered.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(query)
      const descMatch = p.description?.toLowerCase().includes(query) || false
      return nameMatch || descMatch
    })
  }

  // Filtre par prix
  if (options.priceMin !== null && options.priceMin !== undefined) {
    filtered = filtered.filter((p) => p.price >= options.priceMin)
  }
  if (options.priceMax !== null && options.priceMax !== undefined) {
    filtered = filtered.filter((p) => p.price <= options.priceMax)
  }

  // Filtre par stock
  switch (options.stockFilter) {
    case 'in-stock':
      filtered = filtered.filter((p) => p.stock > 0)
      break
    case 'out-of-stock':
      filtered = filtered.filter((p) => p.stock === 0)
      break
  }

  // Tri
  switch (options.sortBy) {
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'stock-desc':
      filtered.sort((a, b) => b.stock - a.stock)
      break
    case 'stock-asc':
      filtered.sort((a, b) => a.stock - b.stock)
      break
  }

  return filtered
}

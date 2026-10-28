import type { Article } from './types'

export const articles: Article[] = []

export function articleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug)
}

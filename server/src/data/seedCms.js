import Blog from '../models/Blog.js'
import { seedBlogs } from './seedBlogs.js'
import { seedInitialTours } from './seedTours.js'

export async function seedInitialBlogs() {
  for (const item of seedBlogs) {
    await Blog.updateOne(
      { slug: item.slug },
      { $setOnInsert: { ...item, published: true, featured: false } },
      { upsert: true },
    )
  }
}

export { seedInitialTours }

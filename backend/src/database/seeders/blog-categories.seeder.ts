import { DataSource } from 'typeorm';
import { BlogCategory } from '../../modules/blogs/entities/blog-category.entity';
import { BlogBlogCategory } from '../../modules/blogs/entities/blog-blog-category.entity';

/** News/Blogs are post types, not categories — remove if they were seeded earlier. */
const TYPE_PSEUDO_CATEGORIES = ['News', 'Blogs'];

export async function cleanupTypePseudoCategories(dataSource: DataSource) {
  const categoryRepo = dataSource.getRepository(BlogCategory);
  const linkRepo = dataSource.getRepository(BlogBlogCategory);

  for (const category of TYPE_PSEUDO_CATEGORIES) {
    const row = await categoryRepo.findOne({ where: { category } });
    if (!row) continue;

    await linkRepo.delete({ categoryId: row.id });
    await categoryRepo.remove(row);
  }

  console.log('✅ Blog type pseudo-categories cleaned up');
}

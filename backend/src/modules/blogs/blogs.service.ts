import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';

import { Blog } from './entities/blog.entity';
import { BlogTag } from './entities/blog-tag.entity';
import { BlogBlogCategory } from './entities/blog-blog-category.entity';
import { Tag } from './entities/tag.entity';
import { BlogCategory } from './entities/blog-category.entity';

import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

import { DB_CONSTANTS } from '../../common/constants/db.constants';
import { deleteFiles } from '../../common/utils/file.util';

@Injectable()
export class BlogsService {

  constructor(
    @InjectRepository(Blog)
    private readonly repo: Repository<Blog>,

    @InjectRepository(BlogTag)
    private readonly tagRepo: Repository<BlogTag>,

    @InjectRepository(Tag)
    private readonly masterTagRepo: Repository<Tag>,

    @InjectRepository(BlogBlogCategory)
    private readonly categoryRepo: Repository<BlogBlogCategory>,

    @InjectRepository(BlogCategory)
    private readonly masterCategoryRepo: Repository<BlogCategory>,

    private readonly dataSource: DataSource,
  ) {}

  private readonly TYPE_PSEUDO_CATEGORIES = new Set(['News', 'Blogs']);

  private async attachBlogData(blogs: Blog[]) {
    if (!blogs.length) return [];

    const blogIds = blogs.map((b) => b.id);

    // Fetch tags
    const blogTags = await this.tagRepo.find({
      where: { blogId: In(blogIds) },
    });

    const tagIds = [...new Set(blogTags.map((bt) => bt.tagId))];
    const masterTags = tagIds.length
      ? await this.masterTagRepo.find({ where: { id: In(tagIds) } })
      : [];

    // Fetch categories
    const blogCategories = await this.categoryRepo.find({
      where: { blogId: In(blogIds) },
    });

    const categoryIds = [...new Set(blogCategories.map((bc) => bc.categoryId))];
    const masterCategories = categoryIds.length
      ? await this.masterCategoryRepo.find({ where: { id: In(categoryIds) } })
      : [];

    return blogs.map((blog) => ({
      ...blog,
      tags: blogTags
        .filter((bt) => bt.blogId === blog.id)
        .map((bt) => masterTags.find((mt) => mt.id === bt.tagId))
        .filter(Boolean),
      categories: blogCategories
        .filter((bc) => bc.blogId === blog.id)
        .map((bc) => masterCategories.find((mc) => mc.id === bc.categoryId))
        .filter(Boolean),
      content: blog.content ? this.parseContent(blog.content) : null,
    }));
  }

  private parseContent(raw: string) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  async create(dto: CreateBlogDto, files: any) {
    return await this.dataSource.transaction(async (manager) => {

      const existing = await manager.findOne(Blog, {
        where: { slug: dto.slug },
      });

      if (existing) {
        deleteFiles(files);
        throw new BadRequestException('Slug already exists');
      }

      const coverFile = files?.image?.[0]?.filename;

      let parsedContent: any = dto.content;

      try {
        parsedContent =
          typeof dto.content === 'string'
            ? JSON.parse(dto.content)
            : dto.content;
      } catch {}

      const contentImages = files?.contentImages || [];

      const replaceImageUrls = (nodes: any[]) => {
        for (const node of nodes || []) {
          if (
            node.type === 'image' &&
            typeof node.attrs?.src === 'string' &&
            node.attrs.src.startsWith('__UPLOAD_')
          ) {
            const index = Number(
              node.attrs.src
                .replace('__UPLOAD_', '')
                .replace('__', '')
            );

            const file = contentImages[index];

            if (file) {
              node.attrs.src = `/uploads/${file.filename}`;
            }
          }

          if (node.content) {
            replaceImageUrls(node.content);
          }
        }
      };

      replaceImageUrls(parsedContent?.content || []);

      const blog = await manager.save(Blog, {
        title: dto.title,
        slug: dto.slug,
        type: dto.type || 'Blog',
        date: dto.date,
        author: dto.author,
        image: coverFile ? `/uploads/${coverFile}` : null,
        content: parsedContent ? JSON.stringify(parsedContent) : null,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        keywords: dto.keywords,
      });

      const tagIds = dto.tags || [];
      const savedBlogTags: BlogTag[] = [];
      for (const tagId of tagIds) {
        const bt = await manager.save(BlogTag, { blogId: blog.id, tagId });
        savedBlogTags.push(bt);
      }

      const categoryIds = dto.categories || [];
      const savedBlogCategories: BlogBlogCategory[] = [];
      for (const categoryId of categoryIds) {
        const bc = await manager.save(BlogBlogCategory, { blogId: blog.id, categoryId });
        savedBlogCategories.push(bc);
      }

      const masterTagIds = [...new Set(savedBlogTags.map((bt) => bt.tagId))];
      const masterTags = masterTagIds.length
        ? await manager.find(Tag, { where: { id: In(masterTagIds) } })
        : [];

      const masterCategoryIds = [...new Set(savedBlogCategories.map((bc) => bc.categoryId))];
      const masterCategories = masterCategoryIds.length
        ? await manager.find(BlogCategory, { where: { id: In(masterCategoryIds) } })
        : [];

      return {
        ...blog,
        tags: savedBlogTags
          .map((bt) => masterTags.find((mt) => mt.id === bt.tagId))
          .filter(Boolean),
        categories: savedBlogCategories
          .map((bc) => masterCategories.find((mc) => mc.id === bc.categoryId))
          .filter(Boolean),
        content: blog.content ? this.parseContent(blog.content) : null,
      };
    });
  }

  async findAll(isDeleted?: boolean) {
    const filter =
      typeof isDeleted === 'boolean'
        ? isDeleted
        : DB_CONSTANTS.IS_DELETED.NO;

    const blogs = await this.repo.find({
      where: { isDeleted: filter },
      order: { date: 'DESC', createdAt: 'DESC' }, // latest date first, fallback to latest created
    });

    if (!blogs.length) return [];

    return this.attachBlogData(blogs);
  }
 

  async findOne(id: number, isDeleted?: boolean) {
  
    const filter =
      typeof isDeleted === 'boolean'
        ? isDeleted
        : DB_CONSTANTS.IS_DELETED.NO;

    const blog = await this.repo.findOne({
      where: { id, isDeleted: filter },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    const [result] = await this.attachBlogData([blog]);
    return result;
  }

  async createNewBlog(dto: CreateBlogDto){
    const newBlog = this.repo.create(dto)
    console.log("printing new blog which i have just created: ", newBlog);
    return await this.repo.save(newBlog);
  }

  async findBySlug(slug: string) {
    const blog = await this.repo.findOne({
      where: { slug, isDeleted: false },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    const [result] = await this.attachBlogData([blog]);
    return result;
  }

  /**
   * Find similar blogs: blogs sharing at least one Tag or Category with the current
   * blog, excluding the current blog itself. Falls back to the latest
   * blogs if there aren't enough tag/category-matched siblings.
   */
  async findSimilar(id: number, limit = 3) {
    const current = await this.repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!current) throw new NotFoundException('Blog not found');

    let similar: Blog[] = [];

    // Tags and Categories attached to the current blog
    const currentBlogTags = await this.tagRepo.find({
      where: { blogId: id },
    });
    const currentTagIds = currentBlogTags.map((bt) => bt.tagId);

    const currentBlogCategories = await this.categoryRepo.find({
      where: { blogId: id },
    });
    const currentCategoryIds = currentBlogCategories.map((bc) => bc.categoryId);

    const candidateBlogIds = new Set<number>();

    // Find blogs sharing tags
    if (currentTagIds.length) {
      const matchingBlogTags = await this.tagRepo.find({
        where: { tagId: In(currentTagIds) },
      });
      matchingBlogTags.forEach((bt) => {
        if (bt.blogId !== id) candidateBlogIds.add(bt.blogId);
      });
    }

    // Find blogs sharing categories
    if (currentCategoryIds.length) {
      const matchingBlogCategories = await this.categoryRepo.find({
        where: { categoryId: In(currentCategoryIds) },
      });
      matchingBlogCategories.forEach((bc) => {
        if (bc.blogId !== id) candidateBlogIds.add(bc.blogId);
      });
    }

    if (candidateBlogIds.size) {
      similar = await this.repo.find({
        where: {
          isDeleted: false,
          id: In(Array.from(candidateBlogIds)),
        },
        order: { date: 'DESC', createdAt: 'DESC' },
        take: limit,
      });
    }

    if (similar.length < limit) {
      const needed = limit - similar.length;
      const existingIds = [id, ...similar.map((b) => b.id)];

      const extras = await this.repo.find({
        where: { isDeleted: false },
        order: { date: 'DESC', createdAt: 'DESC' },
        take: limit + existingIds.length,
      });

      const filtered = extras
        .filter((b) => !existingIds.includes(b.id))
        .slice(0, needed);

      similar = [...similar, ...filtered];
    }

    if (!similar.length) return [];

    return this.attachBlogData(similar);
  }

  /**
   * Return all categories with post counts, sorted by count (desc).
   */
  async findCategories() {
    const categories = await this.masterCategoryRepo.find();

    const counts = await this.categoryRepo
      .createQueryBuilder('bc')
      .select('bc.categoryId', 'categoryId')
      .addSelect('COUNT(DISTINCT bc.blogId)', 'count')
      .innerJoin(Blog, 'b', 'b.id = bc.blogId AND b.isDeleted = :isDeleted', {
        isDeleted: DB_CONSTANTS.IS_DELETED.NO,
      })
      .groupBy('bc.categoryId')
      .getRawMany<{ categoryId: string; count: string }>();

    const countMap = new Map(
      counts.map((row) => [Number(row.categoryId), Number(row.count)]),
    );

    return categories
      .filter((category) => !this.TYPE_PSEUDO_CATEGORIES.has(category.category))
      .map((category) => ({
        ...category,
        count: countMap.get(category.id) || 0,
      }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.category.localeCompare(b.category);
      });
  }

  async update(id: number, dto: UpdateBlogDto, files?: any) {
    return await this.dataSource.transaction(async (manager) => {

      const blog = await manager.findOne(Blog, {
        where: { id, isDeleted: false },
      });

      if (!blog) throw new NotFoundException('Blog not found');

      if (dto.slug && dto.slug !== blog.slug) {
        const exists = await manager.findOne(Blog, {
          where: { slug: dto.slug },
        });
        if (exists) throw new BadRequestException('Slug already exists');
      }

      if (files?.image?.[0]) {
        if (blog.image) {
          const oldFilename = blog.image.replace('/uploads/', '');
          deleteFiles({ image: [{ filename: oldFilename }] });
        }
        blog.image = `/uploads/${files.image[0].filename}`;
      }

      await manager.delete(BlogTag, { blogId: id });
      await manager.delete(BlogBlogCategory, { blogId: id });

      const tagIds = dto.tags || [];
      const categoryIds = dto.categories || [];

      let parsedContent: any = dto.content;

      try {
        parsedContent =
          typeof dto.content === 'string'
            ? JSON.parse(dto.content)
            : dto.content;
      } catch {}

      const contentImages = files?.contentImages || [];

      const replaceImageUrls = (nodes: any[]) => {
        for (const node of nodes || []) {
          if (
            node.type === 'image' &&
            typeof node.attrs?.src === 'string' &&
            node.attrs.src.startsWith('__UPLOAD_')
          ) {
            const index = Number(
              node.attrs.src
                .replace('__UPLOAD_', '')
                .replace('__', '')
            );

            const file = contentImages[index];

            if (file) {
              node.attrs.src = `/uploads/${file.filename}`;
            }
          }

          if (node.content) {
            replaceImageUrls(node.content);
          }
        }
      };

      replaceImageUrls(parsedContent?.content || []);

      for (const tagId of tagIds) {
        await manager.save(BlogTag, {
          blogId: id,
          tagId,
        });
      }

      for (const categoryId of categoryIds) {
        await manager.save(BlogBlogCategory, {
          blogId: id,
          categoryId,
        });
      }

      const { tags: _tags, categories: _categories, content: _content, ...scalarDto } = dto;

      Object.assign(blog, scalarDto);

      blog.content = parsedContent
        ? JSON.stringify(parsedContent)
        : null;

      await manager.save(blog);

      return this.findOne(id);
    });
  }

  async remove(id: number) {
    const blog = await this.repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    blog.isDeleted = true;
    await this.repo.save(blog);

    return [];
  }

  async restore(id: number) {
    const blog = await this.repo.findOne({
      where: { id, isDeleted: true },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    blog.isDeleted = false;
    await this.repo.save(blog);

    return this.findOne(id);
  }

  // ──── CATEGORY MANAGEMENT ─────────────────────────────────────────────────

  async createCategory(category: string) {
    const existing = await this.masterCategoryRepo.findOne({
      where: { category },
    });

    if (existing) {
      return existing;
    }

    return this.masterCategoryRepo.save({ category });
  }

  async deleteCategory(id: number) {
    const category = await this.masterCategoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    await this.categoryRepo.delete({ categoryId: id });
    await this.masterCategoryRepo.remove(category);

    return { message: 'Category deleted successfully' };
  }

  async getAllCategories() {
    return this.masterCategoryRepo.find({
      order: { category: 'ASC' },
    });
  }
}
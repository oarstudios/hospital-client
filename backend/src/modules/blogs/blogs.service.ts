import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';

import { Blog } from './entities/blog.entity';
import { BlogTag } from './entities/blog-tag.entity';
import { Tag } from './entities/tag.entity';

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

    private readonly dataSource: DataSource,
  ) {}

  // ─── Private helpers ─────────────────────────────────────────────────────

  /** Attach tags[] to an array of blog rows in one query */
  private async attachTags(blogs: Blog[]) {
    if (!blogs.length) return [];

    const blogIds = blogs.map((b) => b.id);

    // Get all blog_tags rows for these blogs
    const blogTags = await this.tagRepo.find({
      where: { blogId: In(blogIds) },
    });

    // Get all tag master records for those tagIds
    const tagIds = [...new Set(blogTags.map((bt) => bt.tagId))];
    const masterTags = tagIds.length
      ? await this.masterTagRepo.find({ where: { id: In(tagIds) } })
      : [];

    return blogs.map((blog) => ({
      ...blog,
      // Return full tag objects { id, tag } so frontend can map them
      tags: blogTags
        .filter((bt) => bt.blogId === blog.id)
        .map((bt) => masterTags.find((mt) => mt.id === bt.tagId))
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

  // ─── CREATE ───────────────────────────────────────────────────────────────

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

      const blog = await manager.save(Blog, {
        title:           dto.title,
        slug:            dto.slug,
        type:            dto.type || 'Blog',
        date:            dto.date,
        category:        dto.category,
        author:          dto.author,
        image:           coverFile ? `/uploads/${coverFile}` : null,
        content:         dto.content ?? null,
        metaTitle:       dto.metaTitle,
        metaDescription: dto.metaDescription,
        keywords:        dto.keywords,
      });

      // Save tagIds
      const tagIds = dto.tags || [];

      for (const tagId of tagIds) {
        await manager.save(BlogTag, { blogId: blog.id, tagId });
      }

      return this.findOne(blog.id);
    });
  }

  // ─── FIND ALL ─────────────────────────────────────────────────────────────

  async findAll(isDeleted?: boolean) {
    const filter =
      typeof isDeleted === 'boolean'
        ? isDeleted
        : DB_CONSTANTS.IS_DELETED.NO;

    const blogs = await this.repo.find({
      where: { isDeleted: filter },
      order: { createdAt: 'DESC' },
    });

    if (!blogs.length) return [];

    return this.attachTags(blogs);
  }

  // ─── FIND ONE ─────────────────────────────────────────────────────────────

  async findOne(id: number, isDeleted?: boolean) {
    const filter =
      typeof isDeleted === 'boolean'
        ? isDeleted
        : DB_CONSTANTS.IS_DELETED.NO;

    const blog = await this.repo.findOne({
      where: { id, isDeleted: filter },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    const [result] = await this.attachTags([blog]);
    return result;
  }

  // ─── FIND BY SLUG ─────────────────────────────────────────────────────────

  async findBySlug(slug: string) {
    const blog = await this.repo.findOne({
      where: { slug, isDeleted: false },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    const [result] = await this.attachTags([blog]);
    return result;
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────

  async update(id: number, dto: UpdateBlogDto, files?: any) {
    return await this.dataSource.transaction(async (manager) => {

      const blog = await manager.findOne(Blog, {
        where: { id, isDeleted: false },
      });

      if (!blog) throw new NotFoundException('Blog not found');

      // Slug uniqueness check
      if (dto.slug && dto.slug !== blog.slug) {
        const exists = await manager.findOne(Blog, {
          where: { slug: dto.slug },
        });
        if (exists) throw new BadRequestException('Slug already exists');
      }

      // Replace cover image if a new one was uploaded
      if (files?.image?.[0]) {
        if (blog.image) {
          const oldFilename = blog.image.replace('/uploads/', '');
          deleteFiles({ image: [{ filename: oldFilename }] });
        }
        blog.image = `/uploads/${files.image[0].filename}`;
      }

      // Replace tags if provided — delete old, insert new tagIds
      await manager.delete(BlogTag, { blogId: id });

const tagIds = dto.tags || [];

for (const tagId of tagIds) {
  await manager.save(BlogTag, {
    blogId: id,
    tagId,
  });
}

      // Merge scalar fields
      const { tags: _tags, ...scalarDto } = dto;
      Object.assign(blog, scalarDto);

      await manager.save(blog);

      return this.findOne(id);
    });
  }

  // ─── DELETE (soft) ────────────────────────────────────────────────────────

  async remove(id: number) {
    const blog = await this.repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    blog.isDeleted = true;
    await this.repo.save(blog);

    return [];
  }

  // ─── RESTORE ──────────────────────────────────────────────────────────────

  async restore(id: number) {
    const blog = await this.repo.findOne({
      where: { id, isDeleted: true },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    blog.isDeleted = false;
    await this.repo.save(blog);

    return this.findOne(id);
  }
}
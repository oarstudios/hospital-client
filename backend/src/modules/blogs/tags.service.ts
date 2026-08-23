import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Tag } from '../blogs/entities/tag.entity';
import { BlogTag } from '../blogs/entities/blog-tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly repo: Repository<Tag>,
    @InjectRepository(BlogTag)
    private readonly blogTagRepo: Repository<BlogTag>,
  ) {}

  findAll() {
    return this.repo.find({ order: { tag: 'ASC' } });
  }

  /**
   * Create a new tag, or return the existing one if a tag with the same
   * name (case-insensitive, trimmed) already exists — this is what lets
   * the admin blog form's "type a new tag" flow just work without ever
   * hitting the unique-constraint error or creating a near-duplicate
   * ("Breast Cancer" vs "breast cancer").
   */
  async create(dto: CreateTagDto) {
    const name = dto.tag.trim();

    const existing = await this.repo.findOne({
      where: { tag: ILike(name) },
    });
    if (existing) return existing;

    return this.repo.save({ tag: name });
  }

  async remove(id: number) {
    const tag = await this.repo.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');

    await this.blogTagRepo.delete({ tagId: id });
    await this.repo.remove(tag);

    return { message: 'Tag deleted successfully' };
  }
}
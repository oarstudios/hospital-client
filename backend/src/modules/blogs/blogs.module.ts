import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Blog } from './entities/blog.entity';
import { BlogTag } from './entities/blog-tag.entity';
import { BlogBlogCategory } from './entities/blog-blog-category.entity';
import { BlogCategory } from './entities/blog-category.entity';

import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, BlogTag, Tag, BlogCategory, BlogBlogCategory])
  ],
  controllers: [BlogsController, TagsController],
  providers: [BlogsService, TagsService],
  exports: [BlogsService, TagsService],
})
export class BlogsModule {}
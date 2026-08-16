import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'blogs', name: 'blog_categories' })
export class BlogBlogCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  blogId!: number;

  @Column()
  categoryId!: number;
}

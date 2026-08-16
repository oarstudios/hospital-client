import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'blogs', name: 'categories' })
export class BlogCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  category!: string;
}

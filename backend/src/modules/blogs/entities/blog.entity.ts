import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DB_CONSTANTS } from '../../../common/constants/db.constants';

@Entity({
  schema: 'blogs', name: 'blogs' })
export class Blog {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  slug!: string;

  @Column()
  title!: string;

  // "Blog" | "News" | "Article" etc.
  @Column({ default: 'Blog' })
  type!: string;

  @Column({ nullable: true })
  date?: string;

  // Display name of the author — a doctor's name, or "ICTC" when no doctor is selected
  @Column({ nullable: true })
  author?: string;

  // hospital.doctors.id of the author doctor; null means the post is by ICTC
  @Column({ type: 'int', nullable: true })
  authorId?: number | null;

  // cover image path e.g. /uploads/abc.jpg
  @Column({ nullable: true })
  image?: string;

  // alt text for image (SEO)
  @Column({ nullable: true })
  altText?: string;

  // TipTap rich-text stored as JSON string
  @Column({ type: 'text', nullable: true })
  content?: string;

  // SEO
  @Column({ nullable: true })
  metaTitle?: string;

  @Column({ type: 'text', nullable: true })
  metaDescription?: string;

  @Column({ nullable: true })
  keywords?: string;

  // Soft delete
  @Column({
    type: 'boolean',
    default: DB_CONSTANTS.IS_DELETED.NO,
  })
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
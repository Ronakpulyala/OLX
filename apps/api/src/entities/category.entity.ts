import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne(() => Category, category => category.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @Column({ default: 0 })
  order: number;
}
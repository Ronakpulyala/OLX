import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { ListingImage } from './listing-image.entity';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column('text')
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ default: false })
  isNegotiable: boolean;

  @Column()
  condition: string;

  @Column({ default: 'active' }) // active, sold, inactive
  @Index()
  status: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  sellerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  @OneToMany(() => ListingImage, image => image.listing, { cascade: true })
  images: ListingImage[];

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  @Index({ spatial: true })
  location: any;

  @Column({ nullable: true })
  locationAddress: string;

  @Column({ nullable: true })
  @Index()
  city: string;

  @Column({ type: 'jsonb', nullable: true })
  attributes: Record<string, any>;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  favoriteCount: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ default: false })
  @Index()
  isAIVerified: boolean;

  @Column({ type: 'float', nullable: true })
  aiConfidence: number;

  @Column({ nullable: true })
  verificationAuditId: string;

  @Column({ type: 'jsonb', nullable: true })
  aiDetectionData: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
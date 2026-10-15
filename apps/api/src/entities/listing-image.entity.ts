import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Listing } from './listing.entity';

@Entity('listing_images')
export class ListingImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  listingId: string;

  @ManyToOne(() => Listing, listing => listing.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing: Listing;

  @Column()
  url: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column({ default: 0 })
  order: number;
}
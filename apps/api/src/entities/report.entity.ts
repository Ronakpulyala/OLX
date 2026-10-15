import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Listing } from './listing.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reporterId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @Column({ nullable: true })
  listingId: string;

  @ManyToOne(() => Listing, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'listingId' })
  listing: Listing;

  @Column({ nullable: true })
  userId: string; // If reporting a user

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  reason: string;

  @Column('text')
  description: string;

  @Column({ default: 'pending' }) // pending, reviewed, resolved
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
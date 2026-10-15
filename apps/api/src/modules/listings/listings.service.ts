import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../../entities/listing.entity';
import { Favorite } from '../../entities/favorite.entity';
import { Report } from '../../entities/report.entity';
import { CreateListingDto } from './listings.dto';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing) private repo: Repository<Listing>,
    @InjectRepository(Favorite) private favRepo: Repository<Favorite>,
    @InjectRepository(Report) private reportRepo: Repository<Report>,
  ) {}

  async create(userId: string, dto: CreateListingDto) {
    const slug = slugify(dto.title, { lower: true }) + '-' + uuidv4().substring(0, 6);
    let location = null;
    if (dto.lat && dto.lng) {
      location = { type: 'Point', coordinates: [dto.lng, dto.lat] };
    }
    
    const listing = this.repo.create({
      ...dto,
      slug,
      sellerId: userId,
      location,
      isAIVerified: dto.isAIVerified ?? false,
      aiConfidence: dto.aiConfidence ?? null,
      verificationAuditId: dto.verificationAuditId ?? null,
      aiDetectionData: dto.aiDetectionData ?? null,
      verifiedAt: dto.isAIVerified ? (dto.verifiedAt ? new Date(dto.verifiedAt) : new Date()) : null,
    });
    return this.repo.save(listing);
  }

  async findAll(query: any) {
    const qb = this.repo.createQueryBuilder('listing')
      .leftJoinAndSelect('listing.images', 'images')
      .where('listing.status = :status', { status: 'active' });
    
    if (query.categoryId) {
      qb.andWhere('listing.categoryId = :categoryId', { categoryId: query.categoryId });
    }
    if (query.aiVerified === 'true' || query.isAIVerified === 'true' || query.aiVerified === true || query.isAIVerified === true) {
      qb.andWhere('listing.isAIVerified = :isAIVerified', { isAIVerified: true });
    }
    if (query.condition) {
      qb.andWhere('listing.condition = :condition', { condition: query.condition });
    }
    if (query.minPrice) {
      qb.andWhere('listing.price >= :minPrice', { minPrice: query.minPrice });
    }
    if (query.maxPrice) {
      qb.andWhere('listing.price <= :maxPrice', { maxPrice: query.maxPrice });
    }
    // ST_DWithin for PostGIS
    if (query.lat && query.lng && query.radius) {
      qb.andWhere(`ST_DWithin(listing.location, ST_MakePoint(:lng, :lat)::geography, :radius)`, {
        lng: query.lng,
        lat: query.lat,
        radius: query.radius * 1000 // Convert km to meters
      });
    }

    const [items, total] = await qb.take(query.limit || 10).skip((query.page - 1) * (query.limit || 10) || 0).getManyAndCount();
    return { items, total };
  }

  async findOneBySlug(slug: string) {
    const listing = await this.repo.findOne({ where: { slug }, relations: ['images', 'seller', 'category'] });
    if (!listing) throw new NotFoundException();
    // Increment view
    await this.repo.increment({ id: listing.id }, 'viewCount', 1);
    return listing;
  }

  async update(id: string, userId: string, data: any) {
    await this.repo.update({ id, sellerId: userId }, data);
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: string, userId: string) {
    return this.repo.delete({ id, sellerId: userId });
  }

  async toggleFavorite(userId: string, listingId: string) {
    const existing = await this.favRepo.findOne({ where: { userId, listingId } });
    if (existing) {
      await this.favRepo.remove(existing);
      await this.repo.decrement({ id: listingId }, 'favoriteCount', 1);
      return { status: 'removed' };
    } else {
      await this.favRepo.save(this.favRepo.create({ userId, listingId }));
      await this.repo.increment({ id: listingId }, 'favoriteCount', 1);
      return { status: 'added' };
    }
  }

  async report(userId: string, listingId: string, reason: string, description: string) {
    return this.reportRepo.save(this.reportRepo.create({ reporterId: userId, listingId, reason, description }));
  }
}
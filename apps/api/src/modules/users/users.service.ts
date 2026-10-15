import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Listing } from '../../entities/listing.entity';
import { UpdateProfileDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Listing) private listingsRepo: Repository<Listing>,
  ) {}

  async findOne(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async getUserListings(userId: string) {
    return this.listingsRepo.find({ where: { sellerId: userId }, relations: ['images'] });
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  async findAllTree() {
    return this.repo.find({
      where: { parentId: IsNull() },
      relations: ['children'],
      order: { order: 'ASC' }
    });
  }

  async findBySlug(slug: string) {
    return this.repo.findOne({ where: { slug }, relations: ['children'] });
  }
}
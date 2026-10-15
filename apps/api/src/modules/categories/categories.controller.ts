import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  getAll() {
    return this.service.findAllTree();
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}
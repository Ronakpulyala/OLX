import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './listings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly service: ListingsService) {}

  @Get()
  getAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.service.findOneBySlug(slug);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateListingDto) {
    return this.service.create(req.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.service.update(id, req.user.id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.service.delete(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/favorite')
  favorite(@Param('id') id: string, @Request() req) {
    return this.service.toggleFavorite(req.user.id, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/report')
  report(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.service.report(req.user.id, id, body.reason, body.description);
  }
}
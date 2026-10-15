import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @Get()
  search(@Query() query: any) {
    return this.service.search(query);
  }
}
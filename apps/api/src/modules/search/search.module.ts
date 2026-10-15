import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Listing } from '../../entities/listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule {}
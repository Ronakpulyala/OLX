import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { Listing } from '../../entities/listing.entity';
import { Favorite } from '../../entities/favorite.entity';
import { Report } from '../../entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Favorite, Report])],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule {}
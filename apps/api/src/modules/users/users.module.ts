import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../../entities/user.entity';
import { Listing } from '../../entities/listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Listing])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
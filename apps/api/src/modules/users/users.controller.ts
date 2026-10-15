import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.service.updateProfile(req.user.id, dto);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/listings')
  getUserListings(@Param('id') id: string) {
    return this.service.getUserListings(id);
  }
}
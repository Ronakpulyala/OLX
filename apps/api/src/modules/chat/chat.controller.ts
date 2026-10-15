import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { StartConversationDto } from './chat.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Get()
  getConversations(@Request() req) {
    return this.service.getConversations(req.user.id);
  }

  @Get(':id/messages')
  getMessages(@Param('id') id: string, @Request() req) {
    return this.service.getMessages(id, req.user.id);
  }

  @Post()
  startConversation(@Request() req, @Body() dto: StartConversationDto) {
    return this.service.startConversation(req.user.id, dto.listingId);
  }
}
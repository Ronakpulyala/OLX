import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Conversation } from '../../entities/conversation.entity';
import { Message } from '../../entities/message.entity';
import { Listing } from '../../entities/listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message, Listing])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
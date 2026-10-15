import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('joinConversation')
  handleJoin(@MessageBody() data: { conversationId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.conversationId);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: { conversationId: string, senderId: string, content: string }, @ConnectedSocket() client: Socket) {
    const msg = await this.chatService.saveMessage(data.conversationId, data.senderId, data.content);
    this.server.to(data.conversationId).emit('newMessage', msg);
    return msg;
  }
}
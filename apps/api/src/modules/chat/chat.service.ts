import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../../entities/conversation.entity';
import { Message } from '../../entities/message.entity';
import { Listing } from '../../entities/listing.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation) private convRepo: Repository<Conversation>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    @InjectRepository(Listing) private listingRepo: Repository<Listing>,
  ) {}

  async getConversations(userId: string) {
    return this.convRepo.find({
      where: [ { buyerId: userId }, { sellerId: userId } ],
      relations: ['listing', 'buyer', 'seller'],
      order: { updatedAt: 'DESC' }
    });
  }

  async getMessages(conversationId: string, userId: string) {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } });
    if (!conv || (conv.buyerId !== userId && conv.sellerId !== userId)) {
      throw new NotFoundException();
    }
    return this.msgRepo.find({ where: { conversationId }, order: { createdAt: 'ASC' } });
  }

  async startConversation(userId: string, listingId: string) {
    const listing = await this.listingRepo.findOne({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.sellerId === userId) throw new BadRequestException('Cannot chat with yourself');

    let conv = await this.convRepo.findOne({ where: { listingId, buyerId: userId } });
    if (!conv) {
      conv = this.convRepo.create({ listingId, buyerId: userId, sellerId: listing.sellerId });
      conv = await this.convRepo.save(conv);
    }
    return conv;
  }

  async saveMessage(conversationId: string, senderId: string, content: string) {
    const msg = this.msgRepo.create({ conversationId, senderId, content });
    await this.convRepo.update(conversationId, { updatedAt: new Date() });
    return this.msgRepo.save(msg);
  }
}
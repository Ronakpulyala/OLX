import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(@InjectRepository(Notification) private repo: Repository<Notification>) {}

  async create(userId: string, type: string, title: string, body: string, data?: any) {
    const notif = this.repo.create({ userId, type, title, body, data });
    return this.repo.save(notif);
  }

  async getUserNotifications(userId: string) {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async markAsRead(id: string, userId: string) {
    await this.repo.update({ id, userId }, { isRead: true });
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    await this.repo.update({ userId, isRead: false }, { isRead: true });
    return { success: true };
  }
}
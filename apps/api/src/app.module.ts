import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Entities
import { User } from './entities/user.entity';
import { Listing } from './entities/listing.entity';
import { Category } from './entities/category.entity';
import { ListingImage } from './entities/listing-image.entity';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Favorite } from './entities/favorite.entity';
import { Notification } from './entities/notification.entity';
import { Report } from './entities/report.entity';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ListingsModule } from './modules/listings/listings.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ChatModule } from './modules/chat/chat.module';
import { SearchModule } from './modules/search/search.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AIVerificationModule } from './modules/ai-verification/ai-verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 100,
    }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL') || 'postgresql://postgres:postgres@localhost:5432/sell_db',
        entities: [User, Listing, Category, ListingImage, Conversation, Message, Favorite, Notification, Report],
        synchronize: true, // Auto-sync for dev, use migrations in prod
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ListingsModule,
    CategoriesModule,
    ChatModule,
    SearchModule,
    MediaModule,
    NotificationsModule,
    AIVerificationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}

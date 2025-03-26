import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { NotificationSchema } from './schemas/notification.schema';
import { NotificationTemplateSchema } from './schemas/notification-template.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
      { name: 'NotificationTemplate', schema: NotificationTemplateSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class AppModule {}

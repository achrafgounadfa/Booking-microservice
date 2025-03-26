import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { EventSchema } from './schemas/event.schema';
import { VenueSchema } from './schemas/venue.schema';
import { CategorySchema } from './schemas/category.schema';

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
      { name: 'Event', schema: EventSchema },
      { name: 'Venue', schema: VenueSchema },
      { name: 'Category', schema: CategorySchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '../schemas/event.schema';
import { Venue } from '../schemas/venue.schema';
import { Category } from '../schemas/category.schema';
import { CreateEventDto, UpdateEventDto } from '../../../shared/dto/event.dto';
import { RabbitMQService } from '../../../shared/utils/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { RABBITMQ_PATTERNS } from '../../../shared/constants/index';

@Injectable()
export class EventService {
  private rabbitMQService: RabbitMQService;

  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Venue.name) private venueModel: Model<Venue>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private configService: ConfigService,
  ) {
    // Initialiser RabbitMQ
    this.rabbitMQService = new RabbitMQService({
      urls: [this.configService.get<string>('RABBITMQ_URL')],
      queue: this.configService.get<string>('RABBITMQ_QUEUE'),
    });
  }

  async onModuleInit() {
    // Connecter à RabbitMQ au démarrage
    await this.rabbitMQService.connect();
  }

  async onModuleDestroy() {
    // Fermer la connexion RabbitMQ à l'arrêt
    await this.rabbitMQService.close();
  }

  // Méthodes pour les événements
  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    // Vérifier si la catégorie existe
    const category = await this.categoryModel.findOne({ name: createEventDto.category });
    if (!category) {
      throw new Error('Catégorie non trouvée');
    }

    // Vérifier si le lieu existe
    const venue = await this.venueModel.findById(createEventDto.location.venueId);
    if (!venue) {
      throw new Error('Lieu non trouvé');
    }

    // Préparer les types de billets avec le nombre restant égal à la quantité initiale
    const ticketTypes = createEventDto.ticketTypes.map(type => ({
      ...type,
      remaining: type.quantity,
    }));

    // Créer le nouvel événement
    const newEvent = new this.eventModel({
      ...createEventDto,
      ticketTypes,
    });

    const savedEvent = await newEvent.save();

    // Publier un événement RabbitMQ pour informer les autres services
    await this.rabbitMQService.publish(RABBITMQ_PATTERNS.EVENT_UPDATED, {
      eventId: savedEvent._id,
      action: 'created',
    });

    return savedEvent;
  }

  async getAllEvents(
    page = 1,
    limit = 10,
    category?: string,
    city?: string,
    startDate?: Date,
  ): Promise<{ events: Event[]; total: number; page: number; limit: number }> {
    const query: any = {};

    // Filtres optionnels
    if (category) {
      query.category = category;
    }
    if (city) {
      query['location.city'] = city;
    }
    if (startDate) {
      query['dates.start'] = { $gte: startDate };
    }

    // Ne montrer que les événements publiés
    query.status = 'published';

    const total = await this.eventModel.countDocuments(query);
    const events = await this.eventModel
      .find(query)
      .sort({ 'dates.start': 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      events,
      total,
      page,
      limit,
    };
  }

  async getEventById(eventId: string): Promise<Event> {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new Error('Événement non trouvé');
    }
    return event;
  }

  async updateEvent(eventId: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new Error('Événement non trouvé');
    }

    // Mettre à jour l'événement
    const updatedEvent = await this.eventModel.findByIdAndUpdate(
      eventId,
      { $set: updateEventDto },
      { new: true },
    );

    // Publier un événement RabbitMQ pour informer les autres services
    await this.rabbitMQService.publish(RABBITMQ_PATTERNS.EVENT_UPDATED, {
      eventId,
      action: 'updated',
    });

    return updatedEvent;
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new Error('Événement non trouvé');
    }

    // Vérifier si l'événement a des billets vendus
    const hasTickets = event.ticketTypes.some(type => type.quantity !== type.remaining);
    if (hasTickets) {
      // Si des billets ont été vendus, marquer comme annulé au lieu de supprimer
      await this.eventModel.findByIdAndUpdate(eventId, { status: 'cancelled' });

      // Publier un événement RabbitMQ pour informer les autres services
      await this.rabbitMQService.publish(RABBITMQ_PATTERNS.EVENT_UPDATED, {
        eventId,
        action: 'cancelled',
      });

      return true;
    }

    // Si aucun billet n'a été vendu, supprimer l'événement
    const result = await this.eventModel.deleteOne({ _id: eventId });

    // Publier un événement RabbitMQ pour informer les autres services
    await this.rabbitMQService.publish(RABBITMQ_PATTERNS.EVENT_UPDATED, {
      eventId,
      action: 'deleted',
    });

    return result.deletedCount > 0;
  }

  async updateTicketAvailability(
    eventId: string,
    ticketTypeId: string,
    quantity: number,
  ): Promise<Event> {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new Error('Événement non trouvé');
    }

    const ticketTypeIndex = event.ticketTypes.findIndex(
      type => type._id.toString() === ticketTypeId,
    );
    if (ticketTypeIndex === -1) {
      throw new Error('Type de billet non trouvé');
    }

    // Vérifier la disponibilité
    if (event.ticketTypes[ticketTypeIndex].remaining < quantity) {
      throw new Error('Pas assez de billets disponibles');
    }

    // Mettre à jour la disponibilité
    event.ticketTypes[ticketTypeIndex].remaining -= quantity;

    // Vérifier si l'événement est complet
    const isSoldOut = event.ticketTypes.every(type => type.remaining === 0);
    if (isSoldOut) {
      event.status = 'sold-out';
    }

    return event.save();
  }

  // Méthodes pour les lieux
  async createVenue(venueData: any): Promise<Venue> {
    const newVenue = new this.venueModel(venueData);
    return newVenue.save();
  }

  async getAllVenues(page = 1, limit = 10): Promise<{ venues: Venue[]; total: number }> {
    const total = await this.venueModel.countDocuments();
    const venues = await this.venueModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      venues,
      total,
    };
  }

  async getVenueById(venueId: string): Promise<Venue> {
    const venue = await this.venueModel.findById(venueId);
    if (!venue) {
      throw new Error('Lieu non trouvé');
    }
    return venue;
  }

  async updateVenue(venueId: string, venueData: any): Promise<Venue> {
    const venue = await this.venueModel.findByIdAndUpdate(
      venueId,
      { $set: venueData },
      { new: true },
    );
    if (!venue) {
      throw new Error('Lieu non trouvé');
    }
    return venue;
  }

  async deleteVenue(venueId: string): Promise<boolean> {
    // Vérifier si le lieu est utilisé par des événements
    const eventCount = await this.eventModel.countDocuments({ 'location.venueId': venueId });
    if (eventCount > 0) {
      throw new Error('Ce lieu est utilisé par des événements et ne peut pas être supprimé');
    }

    const result = await this.venueModel.deleteOne({ _id: venueId });
    return result.deletedCount > 0;
  }

  // Méthodes pour les catégories
  async createCategory(categoryData: any): Promise<Category> {
    const existingCategory = await this.categoryModel.findOne({ name: categoryData.name });
    if (existingCategory) {
      throw new Error('Une catégorie avec ce nom existe déjà');
    }

    const newCategory = new this.categoryModel(categoryData);
    return newCategory.save();
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async getCategoryById(categoryId: string): Promise<Category> {
    const category = await this.categoryModel.findById(categoryId);
    if (!category) {
      throw new Error('Catégorie non trouvée');
    }
    return category;
  }

  async updateCategory(categoryId: string, categoryData: any): Promise<Category> {
    if (categoryData.name) {
      const existingCategory = await this.categoryModel.findOne({
        name: categoryData.name,
        _id: { $ne: categoryId },
      });
      if (existingCategory) {
        throw new Error('Une catégorie avec ce nom existe déjà');
      }
    }

    const category = await this.categoryModel.findByIdAndUpdate(
      categoryId,
      { $set: categoryData },
      { new: true },
    );
    if (!category) {
      throw new Error('Catégorie non trouvée');
    }
    return category;
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    // Vérifier si la catégorie est utilisée par des événements
    const eventCount = await this.eventModel.countDocuments({ category: categoryId });
    if (eventCount > 0) {
      throw new Error('Cette catégorie est utilisée par des événements et ne peut pas être supprimée');
    }

    const result = await this.categoryModel.deleteOne({ _id: categoryId });
    return result.deletedCount > 0;
  }
}

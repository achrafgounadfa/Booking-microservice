import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from '../schemas/ticket.schema';
import { Reservation } from '../schemas/reservation.schema';
import { CreateTicketDto, ReservationDto } from '../../../shared/dto/ticket.dto';
import { RabbitMQService } from '../../../shared/utils/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { RABBITMQ_PATTERNS, TICKET_STATUS } from '../../../shared/constants/index';
import axios from 'axios';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TicketService {
  private rabbitMQService: RabbitMQService;

  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
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
    
    // S'abonner aux événements
    await this.rabbitMQService.subscribe(this.handleRabbitMQMessage.bind(this));
  }

  async onModuleDestroy() {
    // Fermer la connexion RabbitMQ à l'arrêt
    await this.rabbitMQService.close();
  }

  private async handleRabbitMQMessage(message: any) {
    const { pattern, data } = message;
    
    switch (pattern) {
      case RABBITMQ_PATTERNS.PAYMENT_COMPLETED:
        await this.confirmReservation(data.reservationId, data.paymentId);
        break;
      default:
        console.log(`Message non géré: ${pattern}`);
    }
  }

  async createReservation(reservationDto: ReservationDto): Promise<Reservation> {
    // Vérifier la disponibilité des billets auprès du service d'événements
    const eventServiceUrl = this.configService.get<string>('EVENT_SERVICE_URL');
    
    for (const ticket of reservationDto.tickets) {
      try {
        await axios.put(
          `${eventServiceUrl}/api/events/${reservationDto.eventId}/tickets/${ticket.ticketTypeId}`,
          { quantity: ticket.quantity },
        );
      } catch (error) {
        throw new Error(`Erreur lors de la vérification de la disponibilité: ${error.message}`);
      }
    }
    
    // Créer la réservation
    const newReservation = new this.reservationModel({
      ...reservationDto,
      status: 'pending',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });
    
    return newReservation.save();
  }

  async confirmReservation(reservationId: string, paymentId: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(reservationId);
    if (!reservation) {
      throw new Error('Réservation non trouvée');
    }
    
    if (reservation.status !== 'pending') {
      throw new Error(`La réservation a déjà été ${reservation.status}`);
    }
    
    // Créer les billets
    const ticketIds = [];
    for (const ticketInfo of reservation.tickets) {
      for (let i = 0; i < ticketInfo.quantity; i++) {
        const ticketDto: CreateTicketDto = {
          eventId: reservation.eventId,
          eventName: '', // À récupérer du service d'événements
          ticketTypeId: ticketInfo.ticketTypeId,
          ticketTypeName: '', // À récupérer du service d'événements
          userId: reservation.userId,
          userName: '', // À récupérer du service d'utilisateurs
          price: ticketInfo.unitPrice,
        };
        
        // Récupérer les informations de l'événement
        try {
          const eventServiceUrl = this.configService.get<string>('EVENT_SERVICE_URL');
          const eventResponse = await axios.get(`${eventServiceUrl}/api/events/${reservation.eventId}`);
          const event = eventResponse.data.event;
          
          ticketDto.eventName = event.name;
          
          const ticketType = event.ticketTypes.find(
            type => type._id.toString() === ticketInfo.ticketTypeId.toString(),
          );
          if (ticketType) {
            ticketDto.ticketTypeName = ticketType.name;
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des informations de l\'événement:', error);
        }
        
        // Récupérer les informations de l'utilisateur
        try {
          const userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
          const userResponse = await axios.get(`${userServiceUrl}/api/users/${reservation.userId}/profile`);
          const userProfile = userResponse.data.profile;
          
          ticketDto.userName = `${userProfile.firstName} ${userProfile.lastName}`;
        } catch (error) {
          console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
        }
        
        // Générer un QR code unique
        const ticketUuid = uuidv4();
        const qrCodeData = {
          ticketId: ticketUuid,
          eventId: reservation.eventId,
          userId: reservation.userId,
        };
        
        const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));
        
        // Créer le billet
        const newTicket = new this.ticketModel({
          ...ticketDto,
          status: TICKET_STATUS.PAID,
          qrCode,
        });
        
        const savedTicket = await newTicket.save();
        ticketIds.push(savedTicket._id);
        
        // Ajouter le billet à l'historique d'achat de l'utilisateur
        try {
          const userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
          await axios.post(`${userServiceUrl}/api/users/${reservation.userId}/purchases/tickets`, {
            ticketId: savedTicket._id,
            eventId: reservation.eventId,
            eventName: ticketDto.eventName,
            price: ticketDto.price,
          });
        } catch (error) {
          console.error('Erreur lors de l\'ajout du billet à l\'historique d\'achat:', error);
        }
      }
    }
    
    // Mettre à jour la réservation
    reservation.status = 'confirmed';
    reservation.confirmedAt = new Date();
    reservation.paymentId = paymentId;
    reservation.ticketIds = ticketIds;
    
    const updatedReservation = await reservation.save();
    
    // Envoyer une notification
    await this.rabbitMQService.publish(RABBITMQ_PATTERNS.NOTIFICATION_SEND, {
      userId: reservation.userId,
      type: 'email',
      template: 'ticket-confirmation',
      content: {
        subject: 'Confirmation de vos billets',
        body: `Vos billets pour l'événement ont été confirmés. Vous pouvez les consulter dans votre espace personnel.`,
      },
      metadata: {
        eventId: reservation.eventId,
        reservationId: reservation._id,
      },
    });
    
    return updatedReservation;
  }

  async cancelReservation(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(reservationId);
    if (!reservation) {
      throw new Error('Réservation non trouvée');
    }
    
    if (reservation.status !== 'pending') {
      throw new Error(`La réservation a déjà été ${reservation.status}`);
    }
    
    // Libérer les billets réservés
    const eventServiceUrl = this.configService.get<string>('EVENT_SERVICE_URL');
    
    for (const ticket of reservation.tickets) {
      try {
        // Logique pour libérer les billets (à implémenter dans le service d'événements)
        // Cette partie dépend de l'implémentation du service d'événements
      } catch (error) {
        console.error('Erreur lors de la libération des billets:', error);
      }
    }
    
    // Mettre à jour la réservation
    reservation.status = 'cancelled';
    reservation.cancelledAt = new Date();
    
    return reservation.save();
  }

  async getReservation(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(reservationId);
    if (!reservation) {
      throw new Error('Réservation non trouvée');
    }
    return reservation;
  }

  async getUserReservations(userId: string): Promise<Reservation[]> {
    return this.reservationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async getTicket(ticketId: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Billet non trouvé');
    }
    return ticket;
  }

  async getUserTickets(userId: string): Promise<Ticket[]> {
    return this.ticketModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async validateTicket(ticketId: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Billet non trouvé');
    }
    
    if (ticket.status !== TICKET_STATUS.PAID) {
      throw new Error(`Le billet a déjà été ${ticket.status}`);
    }
    
    ticket.status = TICKET_STATUS.USED;
    ticket.usedAt = new Date();
    
    // Mettre à jour le statut du billet dans l'historique d'achat de l'utilisateur
    try {
      const userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
      await axios.put(`${userServiceUrl}/api/users/${ticket.userId}/purchases/tickets/${ticket._id}`, {
        status: TICKET_STATUS.USED,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du billet dans l\'historique d\'achat:', error);
    }
    
    return ticket.save();
  }

  async cancelTicket(ticketId: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Billet non trouvé');
    }
    
    if (ticket.status !== TICKET_STATUS.PAID) {
      throw new Error(`Le billet a déjà été ${ticket.status}`);
    }
    
    ticket.status = TICKET_STATUS.CANCELLED;
    ticket.cancelledAt = new Date();
    
    // Mettre à jour le statut du billet dans l'historique d'achat de l'utilisateur
    try {
      const userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
      await axios.put(`${userServiceUrl}/api/users/${ticket.userId}/purchases/tickets/${ticket._id}`, {
        status: TICKET_STATUS.CANCELLED,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du billet dans l\'historique d\'achat:', error);
    }
    
    return ticket.save();
  }

  async refundTicket(ticketId: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Billet non trouvé');
    }
    
    if (ticket.status !== TICKET_STATUS.PAID && ticket.status !== TICKET_STATUS.CANCELLED) {
      throw new Error(`Le billet a déjà été ${ticket.status}`);
    }
    
    ticket.status = TICKET_STATUS.REFUNDED;
    ticket.refundedAt = new Date();
    
    // Mettre à jour le statut du billet dans l'historique d'achat de l'utilisateur
    try {
      const userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
      await axios.put(`${userServiceUrl}/api/users/${ticket.userId}/purchases/tickets/${ticket._id}`, {
        status: TICKET_STATUS.REFUNDED,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du billet dans l\'historique d\'achat:', error);
    }
    
    return ticket.save();
  }
}

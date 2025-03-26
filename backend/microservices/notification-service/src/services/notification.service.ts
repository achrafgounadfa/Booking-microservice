import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notification.schema';
import { NotificationTemplate } from '../schemas/notification-template.schema';
import { NotificationDto, NotificationTemplateDto } from '../../../shared/dto/notification.dto';
import { RabbitMQService } from '../../../shared/utils/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { NOTIFICATION_STATUS } from '../../../shared/constants/index';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private rabbitMQService: RabbitMQService;
  private emailTransporter: any;
  private smsClient: any;

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(NotificationTemplate.name) private notificationTemplateModel: Model<NotificationTemplate>,
    private configService: ConfigService,
  ) {
    // Initialiser RabbitMQ
    this.rabbitMQService = new RabbitMQService({
      urls: [this.configService.get<string>('RABBITMQ_URL')],
      queue: this.configService.get<string>('RABBITMQ_QUEUE'),
    });
    
    // Initialiser le transporteur d'email
    this.emailTransporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
    
    // Initialiser le client SMS (simulé)
    this.smsClient = {
      sendSms: async (to: string, message: string) => {
        console.log(`[SMS Simulé] À: ${to}, Message: ${message}`);
        return { success: true, messageId: `sms_${Date.now()}` };
      },
    };
  }

  async onModuleInit() {
    // Connecter à RabbitMQ au démarrage
    await this.rabbitMQService.connect();
    
    // S'abonner aux événements
    await this.rabbitMQService.subscribe(this.handleRabbitMQMessage.bind(this));
    
    // Créer des modèles de notification par défaut si nécessaires
    await this.createDefaultTemplates();
  }

  async onModuleDestroy() {
    // Fermer la connexion RabbitMQ à l'arrêt
    await this.rabbitMQService.close();
  }

  private async handleRabbitMQMessage(message: any) {
    const { pattern, data } = message;
    
    if (pattern === 'notification.send') {
      await this.sendNotification(data);
    }
  }

  private async createDefaultTemplates() {
    const defaultTemplates = [
      {
        name: 'ticket-confirmation',
        type: 'email',
        subject: 'Confirmation de vos billets',
        body: `Bonjour,

Nous vous confirmons l'achat de vos billets pour l'événement.

Vous pouvez consulter vos billets dans votre espace personnel.

Merci pour votre achat et à bientôt !

L'équipe de billetterie`,
        variables: [],
        language: 'fr',
      },
      {
        name: 'payment-confirmation',
        type: 'email',
        subject: 'Confirmation de paiement',
        body: `Bonjour,

Nous vous confirmons que votre paiement de {{amount}} € a bien été effectué.

Référence de transaction : {{transactionId}}

Merci pour votre achat et à bientôt !

L'équipe de billetterie`,
        variables: ['amount', 'transactionId'],
        language: 'fr',
      },
      {
        name: 'ticket-confirmation-sms',
        type: 'sms',
        subject: '',
        body: `Vos billets pour l'événement ont été confirmés. Consultez votre email pour plus de détails.`,
        variables: [],
        language: 'fr',
      },
    ];
    
    for (const template of defaultTemplates) {
      const existingTemplate = await this.notificationTemplateModel.findOne({ name: template.name });
      if (!existingTemplate) {
        await new this.notificationTemplateModel(template).save();
        console.log(`Modèle de notification créé: ${template.name}`);
      }
    }
  }

  async createNotificationTemplate(templateDto: NotificationTemplateDto): Promise<NotificationTemplate> {
    const existingTemplate = await this.notificationTemplateModel.findOne({ name: templateDto.name });
    if (existingTemplate) {
      throw new Error('Un modèle avec ce nom existe déjà');
    }
    
    const newTemplate = new this.notificationTemplateModel(templateDto);
    return newTemplate.save();
  }

  async getAllNotificationTemplates(): Promise<NotificationTemplate[]> {
    return this.notificationTemplateModel.find().exec();
  }

  async getNotificationTemplate(templateId: string): Promise<NotificationTemplate> {
    const template = await this.notificationTemplateModel.findById(templateId);
    if (!template) {
      throw new Error('Modèle de notification non trouvé');
    }
    return template;
  }

  async updateNotificationTemplate(
    templateId: string,
    templateDto: Partial<NotificationTemplateDto>,
  ): Promise<NotificationTemplate> {
    if (templateDto.name) {
      const existingTemplate = await this.notificationTemplateModel.findOne({
        name: templateDto.name,
        _id: { $ne: templateId },
      });
      if (existingTemplate) {
        throw new Error('Un modèle avec ce nom existe déjà');
      }
    }
    
    const template = await this.notificationTemplateModel.findByIdAndUpdate(
      templateId,
      { $set: templateDto },
      { new: true },
    );
    
    if (!template) {
      throw new Error('Modèle de notification non trouvé');
    }
    
    return template;
  }

  async deleteNotificationTemplate(templateId: string): Promise<boolean> {
    const result = await this.notificationTemplateModel.deleteOne({ _id: templateId });
    return result.deletedCount > 0;
  }

  async sendNotification(notificationDto: NotificationDto): Promise<Notification> {
    // Récupérer le modèle de notification
    const template = await this.notificationTemplateModel.findOne({ name: notificationDto.template });
    if (!template) {
      throw new Error(`Modèle de notification non trouvé: ${notificationDto.template}`);
    }
    
    // Créer la notification
    const newNotification = new this.notificationModel({
      ...notificationDto,
      status: NOTIFICATION_STATUS.PENDING,
    });
    
    const savedNotification = await newNotification.save();
    
    // Envoyer la notification
    try {
      if (template.type === 'email') {
        await this.sendEmail(savedNotification);
      } else if (template.type === 'sms') {
        await this.sendSms(savedNotification);
      }
      
      // Mettre à jour le statut
      savedNotification.status = NOTIFICATION_STATUS.SENT;
      savedNotification.sentAt = new Date();
      await savedNotification.save();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      savedNotification.status = NOTIFICATION_STATUS.FAILED;
      await savedNotification.save();
      throw error;
    }
    
    return savedNotification;
  }

  private async sendEmail(notification: Notification): Promise<void> {
    // Récupérer l'email de l'utilisateur
    const userEmail = await this.getUserEmail(notification.userId);
    
    // Envoyer l'email
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: userEmail,
      subject: notification.content.subject,
      text: notification.content.body,
    };
    
    // Dans un environnement de production, on enverrait réellement l'email
    // Pour ce projet, on simule l'envoi
    console.log(`[Email Simulé] À: ${userEmail}, Sujet: ${mailOptions.subject}`);
    
    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private async sendSms(notification: Notification): Promise<void> {
    // Récupérer le numéro de téléphone de l'utilisateur
    const userPhone = await this.getUserPhone(notification.userId);
    
    // Envoyer le SMS
    // Dans un environnement de production, on utiliserait un service SMS réel
    // Pour ce projet, on simule l'envoi
    await this.smsClient.sendSms(userPhone, notification.content.body);
    
    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  private async getUserEmail(userId: string): Promise<string> {
    try {
      // Dans un environnement réel, on ferait une requête au service utilisateur
      // Pour ce projet, on simule la récupération
      return `user_${userId}@example.com`;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'email de l\'utilisateur:', error);
      throw new Error('Impossible de récupérer l\'email de l\'utilisateur');
    }
  }

  private async getUserPhone(userId: string): Promise<string> {
    try {
      // Dans un environnement réel, on ferait une requête au service utilisateur
      // Pour ce projet, on simule la récupération
      return `+33612345678`;
    } catch (error) {
      console.error('Erreur lors de la récupération du téléphone de l\'utilisateur:', error);
      throw new Error('Impossible de récupérer le téléphone de l\'utilisateur');
    }
  }

  async getNotification(notificationId: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) {
      throw new Error('Notification non trouvée');
    }
    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async markAsDelivered(notificationId: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) {
      throw new Error('Notification non trouvée');
    }
    
    notification.status = NOTIFICATION_STATUS.DELIVERED;
    notification.deliveredAt = new Date();
    
    return notification.save();
  }

  async resendNotification(notificationId: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) {
      throw new Error('Notification non trouvée');
    }
    
    // Réinitialiser le statut
    notification.status = NOTIFICATION_STATUS.PENDING;
    notification.sentAt = undefined;
    notification.deliveredAt = undefined;
    
    await notification.save();
    
    // Renvoyer la notification
    return this.sendNotification({
      userId: notification.userId.toString(),
      type: notification.type,
      template: notification.template,
      content: notification.content,
      metadata: notification.metadata,
    });
  }
}

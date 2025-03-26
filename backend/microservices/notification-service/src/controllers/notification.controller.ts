import { Controller, Get, Post, Put, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationDto, NotificationTemplateDto } from '../../../shared/dto/notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Endpoints pour les modèles de notification
  @Post('templates')
  async createNotificationTemplate(@Body() templateDto: NotificationTemplateDto) {
    try {
      const template = await this.notificationService.createNotificationTemplate(templateDto);
      return {
        success: true,
        message: 'Modèle de notification créé avec succès',
        template,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('templates')
  async getAllNotificationTemplates() {
    try {
      const templates = await this.notificationService.getAllNotificationTemplates();
      return {
        success: true,
        templates,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('templates/:id')
  async getNotificationTemplate(@Param('id') id: string) {
    try {
      const template = await this.notificationService.getNotificationTemplate(id);
      return {
        success: true,
        template,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put('templates/:id')
  async updateNotificationTemplate(
    @Param('id') id: string,
    @Body() templateDto: Partial<NotificationTemplateDto>,
  ) {
    try {
      const template = await this.notificationService.updateNotificationTemplate(id, templateDto);
      return {
        success: true,
        message: 'Modèle de notification mis à jour avec succès',
        template,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Endpoints pour les notifications
  @Post()
  async sendNotification(@Body() notificationDto: NotificationDto) {
    try {
      const notification = await this.notificationService.sendNotification(notificationDto);
      return {
        success: true,
        message: 'Notification envoyée avec succès',
        notification,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async getNotification(@Param('id') id: string) {
    try {
      const notification = await this.notificationService.getNotification(id);
      return {
        success: true,
        notification,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('users/:userId')
  async getUserNotifications(@Param('userId') userId: string) {
    try {
      const notifications = await this.notificationService.getUserNotifications(userId);
      return {
        success: true,
        notifications,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/delivered')
  async markAsDelivered(@Param('id') id: string) {
    try {
      const notification = await this.notificationService.markAsDelivered(id);
      return {
        success: true,
        message: 'Notification marquée comme livrée',
        notification,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':id/resend')
  async resendNotification(@Param('id') id: string) {
    try {
      const notification = await this.notificationService.resendNotification(id);
      return {
        success: true,
        message: 'Notification renvoyée avec succès',
        notification,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

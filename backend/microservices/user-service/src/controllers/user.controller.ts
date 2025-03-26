import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserProfileDto } from '../../../shared/dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':userId/profile')
  async createUserProfile(
    @Param('userId') userId: string,
    @Body() userProfileDto: UserProfileDto,
  ) {
    try {
      // Vérifier si l'utilisateur existe dans le service d'authentification
      const userExists = await this.userService.validateUserExists(userId);
      if (!userExists) {
        throw new Error('Utilisateur non trouvé dans le service d\'authentification');
      }
      
      const userProfile = await this.userService.createUserProfile(userId, userProfileDto);
      return {
        success: true,
        message: 'Profil utilisateur créé avec succès',
        profile: userProfile,
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

  @Get(':userId/profile')
  async getUserProfile(@Param('userId') userId: string) {
    try {
      const userProfile = await this.userService.getUserProfile(userId);
      return {
        success: true,
        profile: userProfile,
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

  @Put(':userId/profile')
  async updateUserProfile(
    @Param('userId') userId: string,
    @Body() userProfileDto: Partial<UserProfileDto>,
  ) {
    try {
      const userProfile = await this.userService.updateUserProfile(userId, userProfileDto);
      return {
        success: true,
        message: 'Profil utilisateur mis à jour avec succès',
        profile: userProfile,
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

  @Delete(':userId/profile')
  async deleteUserProfile(@Param('userId') userId: string) {
    try {
      const result = await this.userService.deleteUserProfile(userId);
      return {
        success: result,
        message: result ? 'Profil utilisateur supprimé avec succès' : 'Profil utilisateur non trouvé',
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

  @Get(':userId/purchases')
  async getPurchaseHistory(@Param('userId') userId: string) {
    try {
      const purchaseHistory = await this.userService.getPurchaseHistory(userId);
      return {
        success: true,
        purchases: purchaseHistory.tickets,
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

  @Post(':userId/purchases/tickets')
  async addTicketToPurchaseHistory(
    @Param('userId') userId: string,
    @Body() ticketData: {
      ticketId: string;
      eventId: string;
      eventName: string;
      price: number;
    },
  ) {
    try {
      const { ticketId, eventId, eventName, price } = ticketData;
      const purchaseHistory = await this.userService.addTicketToPurchaseHistory(
        userId,
        ticketId,
        eventId,
        eventName,
        price,
      );
      return {
        success: true,
        message: 'Billet ajouté à l\'historique d\'achat avec succès',
        purchases: purchaseHistory.tickets,
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

  @Put(':userId/purchases/tickets/:ticketId')
  async updateTicketStatus(
    @Param('userId') userId: string,
    @Param('ticketId') ticketId: string,
    @Body() statusData: { status: string },
  ) {
    try {
      const purchaseHistory = await this.userService.updateTicketStatus(
        userId,
        ticketId,
        statusData.status,
      );
      return {
        success: true,
        message: 'Statut du billet mis à jour avec succès',
        purchases: purchaseHistory.tickets,
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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProfile } from '../schemas/user-profile.schema';
import { PurchaseHistory } from '../schemas/purchase-history.schema';
import { UserProfileDto } from '../../../shared/dto/user.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfile>,
    @InjectModel(PurchaseHistory.name) private purchaseHistoryModel: Model<PurchaseHistory>,
    private configService: ConfigService,
  ) {}

  async createUserProfile(userId: string, userProfileDto: UserProfileDto): Promise<UserProfile> {
    // Vérifier si le profil existe déjà
    const existingProfile = await this.userProfileModel.findOne({ userId });
    if (existingProfile) {
      throw new Error('Le profil utilisateur existe déjà');
    }
    
    // Créer le nouveau profil
    const newUserProfile = new this.userProfileModel({
      userId,
      ...userProfileDto,
    });
    
    // Créer un historique d'achat vide pour l'utilisateur
    await new this.purchaseHistoryModel({ userId, tickets: [] }).save();
    
    return newUserProfile.save();
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const userProfile = await this.userProfileModel.findOne({ userId });
    if (!userProfile) {
      throw new Error('Profil utilisateur non trouvé');
    }
    return userProfile;
  }

  async updateUserProfile(userId: string, userProfileDto: Partial<UserProfileDto>): Promise<UserProfile> {
    const userProfile = await this.userProfileModel.findOneAndUpdate(
      { userId },
      { $set: userProfileDto },
      { new: true },
    );
    
    if (!userProfile) {
      throw new Error('Profil utilisateur non trouvé');
    }
    
    return userProfile;
  }

  async deleteUserProfile(userId: string): Promise<boolean> {
    const result = await this.userProfileModel.deleteOne({ userId });
    await this.purchaseHistoryModel.deleteOne({ userId });
    
    return result.deletedCount > 0;
  }

  async getPurchaseHistory(userId: string): Promise<PurchaseHistory> {
    const purchaseHistory = await this.purchaseHistoryModel.findOne({ userId });
    if (!purchaseHistory) {
      throw new Error('Historique d\'achat non trouvé');
    }
    return purchaseHistory;
  }

  async addTicketToPurchaseHistory(
    userId: string,
    ticketId: string,
    eventId: string,
    eventName: string,
    price: number,
  ): Promise<PurchaseHistory> {
    const purchaseHistory = await this.purchaseHistoryModel.findOne({ userId });
    if (!purchaseHistory) {
      throw new Error('Historique d\'achat non trouvé');
    }
    
    purchaseHistory.tickets.push({
      ticketId,
      eventId,
      eventName,
      purchaseDate: new Date(),
      price,
      status: 'active',
    });
    
    return purchaseHistory.save();
  }

  async updateTicketStatus(userId: string, ticketId: string, status: string): Promise<PurchaseHistory> {
    const purchaseHistory = await this.purchaseHistoryModel.findOne({ userId });
    if (!purchaseHistory) {
      throw new Error('Historique d\'achat non trouvé');
    }
    
    const ticketIndex = purchaseHistory.tickets.findIndex(
      ticket => ticket.ticketId.toString() === ticketId,
    );
    
    if (ticketIndex === -1) {
      throw new Error('Billet non trouvé dans l\'historique d\'achat');
    }
    
    purchaseHistory.tickets[ticketIndex].status = status;
    
    return purchaseHistory.save();
  }

  async validateUserExists(userId: string): Promise<boolean> {
    try {
      const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
      const response = await axios.get(`${authServiceUrl}/api/auth/validate/${userId}`);
      return response.data.success;
    } catch (error) {
      return false;
    }
  }
}

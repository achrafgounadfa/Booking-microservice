import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { RefreshToken } from '../schemas/refresh-token.schema';
import { CreateUserDto, LoginUserDto, TokenResponseDto } from '../../../shared/dto/user.dto';
import { AuthUtils } from '../../../shared/utils/auth.utils';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role } = createUserDto;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }
    
    // Hasher le mot de passe
    const hashedPassword = await AuthUtils.hashPassword(password);
    
    // Créer le nouvel utilisateur
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
    });
    
    return newUser.save();
  }

  async login(loginUserDto: LoginUserDto): Promise<TokenResponseDto> {
    const { email, password } = loginUserDto;
    
    // Trouver l'utilisateur
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await AuthUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();
    
    // Générer les tokens
    return this.generateTokens(user);
  }

  async refreshToken(token: string): Promise<TokenResponseDto> {
    // Trouver le refresh token
    const refreshToken = await this.refreshTokenModel.findOne({ token });
    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new Error('Token de rafraîchissement invalide ou expiré');
    }
    
    // Trouver l'utilisateur
    const user = await this.userModel.findById(refreshToken.userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    // Supprimer l'ancien refresh token
    await this.refreshTokenModel.deleteOne({ _id: refreshToken._id });
    
    // Générer de nouveaux tokens
    return this.generateTokens(user);
  }

  async logout(token: string): Promise<boolean> {
    // Supprimer le refresh token
    const result = await this.refreshTokenModel.deleteOne({ token });
    return result.deletedCount > 0;
  }

  private async generateTokens(user: User): Promise<TokenResponseDto> {
    const payload = { sub: user._id, email: user.email, role: user.role };
    
    // Générer l'access token
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });
    
    // Générer le refresh token
    const refreshToken = uuidv4();
    
    // Sauvegarder le refresh token
    const refreshTokenDoc = new this.refreshTokenModel({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    });
    await refreshTokenDoc.save();
    
    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 heure en secondes
      userId: user._id.toString(),
      role: user.role,
    };
  }

  async validateUser(userId: string): Promise<User> {
    return this.userModel.findById(userId);
  }
}

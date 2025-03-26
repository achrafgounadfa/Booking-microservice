import { Controller, Post, Body, HttpException, HttpStatus, Get, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto, LoginUserDto } from '../../../shared/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.register(createUserDto);
      return {
        success: true,
        message: 'Utilisateur créé avec succès',
        userId: user._id,
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

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const tokenResponse = await this.authService.login(loginUserDto);
      return {
        success: true,
        ...tokenResponse,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: error.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      const tokenResponse = await this.authService.refreshToken(body.refreshToken);
      return {
        success: true,
        ...tokenResponse,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: error.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    try {
      const result = await this.authService.logout(body.refreshToken);
      return {
        success: result,
        message: result ? 'Déconnexion réussie' : 'Token non trouvé',
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

  @Get('validate/:userId')
  async validateUser(@Param('userId') userId: string) {
    try {
      const user = await this.authService.validateUser(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      return {
        success: true,
        userId: user._id,
        email: user.email,
        role: user.role,
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
}

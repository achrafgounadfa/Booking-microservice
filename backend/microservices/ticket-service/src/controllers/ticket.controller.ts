import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { TicketService } from '../services/ticket.service';
import { ReservationDto } from '../../../shared/dto/ticket.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // Endpoints pour les réservations
  @Post('reservations')
  async createReservation(@Body() reservationDto: ReservationDto) {
    try {
      const reservation = await this.ticketService.createReservation(reservationDto);
      return {
        success: true,
        message: 'Réservation créée avec succès',
        reservation,
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

  @Get('reservations/:id')
  async getReservation(@Param('id') id: string) {
    try {
      const reservation = await this.ticketService.getReservation(id);
      return {
        success: true,
        reservation,
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

  @Get('users/:userId/reservations')
  async getUserReservations(@Param('userId') userId: string) {
    try {
      const reservations = await this.ticketService.getUserReservations(userId);
      return {
        success: true,
        reservations,
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

  @Put('reservations/:id/confirm')
  async confirmReservation(
    @Param('id') id: string,
    @Body() data: { paymentId: string },
  ) {
    try {
      const reservation = await this.ticketService.confirmReservation(id, data.paymentId);
      return {
        success: true,
        message: 'Réservation confirmée avec succès',
        reservation,
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

  @Put('reservations/:id/cancel')
  async cancelReservation(@Param('id') id: string) {
    try {
      const reservation = await this.ticketService.cancelReservation(id);
      return {
        success: true,
        message: 'Réservation annulée avec succès',
        reservation,
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

  // Endpoints pour les billets
  @Get(':id')
  async getTicket(@Param('id') id: string) {
    try {
      const ticket = await this.ticketService.getTicket(id);
      return {
        success: true,
        ticket,
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
  async getUserTickets(@Param('userId') userId: string) {
    try {
      const tickets = await this.ticketService.getUserTickets(userId);
      return {
        success: true,
        tickets,
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

  @Put(':id/validate')
  async validateTicket(@Param('id') id: string) {
    try {
      const ticket = await this.ticketService.validateTicket(id);
      return {
        success: true,
        message: 'Billet validé avec succès',
        ticket,
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

  @Put(':id/cancel')
  async cancelTicket(@Param('id') id: string) {
    try {
      const ticket = await this.ticketService.cancelTicket(id);
      return {
        success: true,
        message: 'Billet annulé avec succès',
        ticket,
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

  @Put(':id/refund')
  async refundTicket(@Param('id') id: string) {
    try {
      const ticket = await this.ticketService.refundTicket(id);
      return {
        success: true,
        message: 'Billet remboursé avec succès',
        ticket,
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

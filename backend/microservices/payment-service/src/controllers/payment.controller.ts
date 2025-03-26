import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { PaymentDto, RefundDto } from '../../../shared/dto/payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async processPayment(@Body() paymentDto: PaymentDto) {
    try {
      const transaction = await this.paymentService.processPayment(paymentDto);
      return {
        success: true,
        message: 'Paiement traité avec succès',
        transaction,
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
  async getTransaction(@Param('id') id: string) {
    try {
      const transaction = await this.paymentService.getTransaction(id);
      return {
        success: true,
        transaction,
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
  async getUserTransactions(@Param('userId') userId: string) {
    try {
      const transactions = await this.paymentService.getUserTransactions(userId);
      return {
        success: true,
        transactions,
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

  @Post(':id/refund')
  async refundTransaction(@Param('id') id: string, @Body() refundDto: RefundDto) {
    try {
      const transaction = await this.paymentService.refundTransaction(id, refundDto);
      return {
        success: true,
        message: 'Remboursement traité avec succès',
        transaction,
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

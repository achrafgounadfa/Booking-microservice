import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../schemas/transaction.schema';
import { PaymentBackup } from '../schemas/payment-backup.schema';
import { PaymentDto, RefundDto } from '../../../shared/dto/payment.dto';
import { RabbitMQService } from '../../../shared/utils/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { RABBITMQ_PATTERNS, PAYMENT_STATUS } from '../../../shared/constants/index';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private rabbitMQService: RabbitMQService;
  private backupInterval: NodeJS.Timeout;

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(PaymentBackup.name) private paymentBackupModel: Model<PaymentBackup>,
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
    
    // Configurer la sauvegarde régulière des paiements
    const backupIntervalMinutes = this.configService.get<number>('PAYMENT_BACKUP_INTERVAL_MINUTES') || 60;
    this.backupInterval = setInterval(() => {
      this.backupPayments();
    }, backupIntervalMinutes * 60 * 1000);
  }

  async onModuleDestroy() {
    // Arrêter l'intervalle de sauvegarde
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
    }
    
    // Fermer la connexion RabbitMQ à l'arrêt
    await this.rabbitMQService.close();
  }

  async processPayment(paymentDto: PaymentDto): Promise<Transaction> {
    // Simuler le traitement du paiement par carte bancaire
    // Dans un environnement de production, cela serait remplacé par l'intégration d'un processeur de paiement réel
    
    // Générer un ID de paiement unique
    const paymentIntentId = `pi_${crypto.randomBytes(16).toString('hex')}`;
    
    // Créer la transaction
    const newTransaction = new this.transactionModel({
      ...paymentDto,
      paymentIntentId,
      status: PAYMENT_STATUS.PENDING,
    });
    
    const savedTransaction = await newTransaction.save();
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simuler un taux de réussite de 95%
    const isSuccessful = Math.random() < 0.95;
    
    if (isSuccessful) {
      // Mettre à jour le statut de la transaction
      savedTransaction.status = PAYMENT_STATUS.COMPLETED;
      await savedTransaction.save();
      
      // Publier un événement RabbitMQ pour informer les autres services
      await this.rabbitMQService.publish(RABBITMQ_PATTERNS.PAYMENT_COMPLETED, {
        transactionId: savedTransaction._id,
        reservationId: savedTransaction.reservationId,
        paymentId: savedTransaction._id,
        amount: savedTransaction.amount,
        status: PAYMENT_STATUS.COMPLETED,
      });
      
      return savedTransaction;
    } else {
      // Simuler un échec de paiement
      savedTransaction.status = PAYMENT_STATUS.FAILED;
      await savedTransaction.save();
      
      throw new Error('Le paiement a échoué. Veuillez réessayer ou utiliser une autre méthode de paiement.');
    }
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction non trouvée');
    }
    return transaction;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async refundTransaction(transactionId: string, refundDto: RefundDto): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction non trouvée');
    }
    
    if (transaction.status !== PAYMENT_STATUS.COMPLETED) {
      throw new Error('Seules les transactions complétées peuvent être remboursées');
    }
    
    // Vérifier que le montant du remboursement est valide
    const totalRefunded = transaction.refunds.reduce((sum, refund) => sum + refund.amount, 0);
    const availableForRefund = transaction.amount - totalRefunded;
    
    if (refundDto.amount > availableForRefund) {
      throw new Error(`Le montant du remboursement ne peut pas dépasser ${availableForRefund}`);
    }
    
    // Ajouter le remboursement
    transaction.refunds.push({
      amount: refundDto.amount,
      reason: refundDto.reason,
      timestamp: new Date(),
    });
    
    // Mettre à jour le statut si nécessaire
    if (totalRefunded + refundDto.amount === transaction.amount) {
      transaction.status = PAYMENT_STATUS.REFUNDED;
    } else if (totalRefunded + refundDto.amount > 0) {
      transaction.status = PAYMENT_STATUS.PARTIALLY_REFUNDED;
    }
    
    return transaction.save();
  }

  private async backupPayments(): Promise<void> {
    try {
      // Récupérer toutes les transactions qui n'ont pas encore été sauvegardées
      const lastBackup = await this.paymentBackupModel
        .findOne()
        .sort({ backupDate: -1 })
        .exec();
      
      const query = lastBackup
        ? { createdAt: { $gt: lastBackup.backupDate } }
        : {};
      
      const transactions = await this.transactionModel.find(query).exec();
      
      if (transactions.length === 0) {
        console.log('Aucune nouvelle transaction à sauvegarder');
        return;
      }
      
      // Chiffrer les données de paiement
      const encryptionKey = this.configService.get<string>('PAYMENT_ENCRYPTION_KEY');
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
      
      for (const transaction of transactions) {
        // Préparer les données à chiffrer
        const dataToEncrypt = JSON.stringify({
          transactionId: transaction._id,
          userId: transaction.userId,
          reservationId: transaction.reservationId,
          amount: transaction.amount,
          currency: transaction.currency,
          paymentMethod: transaction.paymentMethod,
          status: transaction.status,
          paymentIntentId: transaction.paymentIntentId,
          refunds: transaction.refunds,
          createdAt: transaction.createdAt,
        });
        
        // Chiffrer les données
        let encrypted = cipher.update(dataToEncrypt, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const encryptedData = iv.toString('hex') + ':' + encrypted;
        
        // Créer la sauvegarde
        const backup = new this.paymentBackupModel({
          transactionId: transaction._id,
          backupData: encryptedData,
          backupDate: new Date(),
        });
        
        await backup.save();
      }
      
      console.log(`${transactions.length} transactions sauvegardées avec succès`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paiements:', error);
    }
  }
}

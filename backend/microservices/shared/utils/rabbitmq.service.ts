export class RabbitMQService {
  private connection: any;
  private channel: any;
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async connect() {
    try {
      const { urls, queue, queueOptions } = this.config;
      const amqp = require('amqplib');
      
      // Connexion à RabbitMQ
      this.connection = await amqp.connect(urls[0]);
      this.channel = await this.connection.createChannel();
      
      // Création de la file d'attente
      await this.channel.assertQueue(queue, queueOptions || { durable: true });
      
      console.log(`[RabbitMQ] Connecté à ${urls[0]}, file d'attente: ${queue}`);
      return this.channel;
    } catch (error) {
      console.error('[RabbitMQ] Erreur de connexion:', error);
      throw error;
    }
  }

  async publish(pattern: string, data: any) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      
      const message = { pattern, data };
      return this.channel.sendToQueue(
        this.config.queue,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );
    } catch (error) {
      console.error('[RabbitMQ] Erreur de publication:', error);
      throw error;
    }
  }

  async subscribe(callback: (message: any) => void) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      
      return this.channel.consume(this.config.queue, (msg: any) => {
        if (msg !== null) {
          const messageContent = JSON.parse(msg.content.toString());
          callback(messageContent);
          this.channel.ack(msg);
        }
      });
    } catch (error) {
      console.error('[RabbitMQ] Erreur d\'abonnement:', error);
      throw error;
    }
  }

  async close() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      console.log('[RabbitMQ] Connexion fermée');
    } catch (error) {
      console.error('[RabbitMQ] Erreur de fermeture:', error);
    }
  }
}

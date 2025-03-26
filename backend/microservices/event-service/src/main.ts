import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activer la validation globale des DTOs
  app.useGlobalPipes(new ValidationPipe());
  
  // Activer CORS
  app.enableCors();
  
  // Préfixe global pour les routes API
  app.setGlobalPrefix('api');
  
  // Récupérer le port depuis la configuration
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3003;
  
  await app.listen(port);
  console.log(`Event Service is running on port ${port}`);
}
bootstrap();

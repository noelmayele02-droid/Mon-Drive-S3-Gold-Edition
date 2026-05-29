import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    // Chargement global du module de configuration pour lire le fichier .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    S3Module,
  ],
})
export class AppModule {}
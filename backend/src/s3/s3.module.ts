import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Readable } from 'stream';

// Structure pour simuler les fichiers stockés en mémoire
interface FakeS3File {
  name: string;
  size: number;
  buffer: Buffer;
  contentType: string;
}

@Injectable()
export class S3Service {
  // Notre "Bucket" virtuel local
  private fakeBucket: FakeS3File[] = [];

  // 1. Lister les fichiers simulés
  async listFiles(key: string, secret: string, region: string, bucket: string) {
    // On valide quand même la présence de données dans l'interface
    if (!key || !secret || !bucket) {
      throw new HttpException("Configuration incomplète.", HttpStatus.BAD_REQUEST);
    }
    
    // Renvoie la liste des fichiers stockés virtuellement
    return this.fakeBucket.map(file => ({
      name: file.name,
      size: file.size,
    }));
  }

  // 2. Simuler le dépôt (Upload)
  async uploadFile(file: Express.Multer.File, key: string, secret: string, region: string, bucket: string) {
    if (!key || !secret || !bucket) {
      throw new HttpException("Configuration incomplète.", HttpStatus.BAD_REQUEST);
    }
    if (!file) {
      throw new HttpException("Aucun fichier fourni.", HttpStatus.BAD_REQUEST);
    }

    // Supprime l'ancien si doublon
    this.fakeBucket = this.fakeBucket.filter(f => f.name !== file.originalname);

    // Ajoute au bucket virtuel
    this.fakeBucket.push({
      name: file.originalname,
      size: file.size,
      buffer: file.buffer,
      contentType: file.mimetype
    });

    return { message: 'OK' };
  }

  // 3. Simuler la récupération (Download)
  async downloadFile(filename: string, key: string, secret: string, region: string, bucket: string) {
    const file = this.fakeBucket.find(f => f.name === filename);
    
    if (!file) {
      throw new HttpException('Fichier introuvable sur le S3 virtuel', HttpStatus.NOT_FOUND);
    }

    // Transforme le buffer en flux de lecture (Stream) comme le vrai AWS
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);

    return {
      stream,
      contentType: file.contentType
    };
  }

  // 4. Simuler la suppression
  async deleteFile(filename: string, key: string, secret: string, region: string, bucket: string) {
    const initialLength = this.fakeBucket.length;
    this.fakeBucket = this.fakeBucket.filter(f => f.name !== filename);

    if (this.fakeBucket.length === initialLength) {
      throw new HttpException('Fichier introuvable', HttpStatus.NOT_FOUND);
    }

    return { message: 'Deleted' };
  }
}
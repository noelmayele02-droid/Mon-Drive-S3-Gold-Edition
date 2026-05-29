import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  
  // Génère un client S3 à la demande avec les clés reçues du Front
  private createS3Client(key: string, secret: string, region: string) {
    if (!key || !secret) {
      throw new HttpException("Clés d'authentification AWS manquantes.", HttpStatus.UNAUTHORIZED);
    }
    return new S3Client({
      region: region || 'eu-west-3',
      credentials: { accessKeyId: key, secretAccessKey: secret }
    });
  }

  async listFiles(key: string, secret: string, region: string, bucket: string) {
    try {
      const s3 = this.createS3Client(key, secret, region);
      const command = new ListObjectsV2Command({ Bucket: bucket });
      const data = await s3.send(command);
      return data.Contents?.map(item => ({ name: item.Key, size: item.Size })) || [];
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async uploadFile(file: Express.Multer.File, key: string, secret: string, region: string, bucket: string) {
    try {
      const s3 = this.createS3Client(key, secret, region);
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await s3.send(command);
      return { message: 'OK' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async downloadFile(filename: string, key: string, secret: string, region: string, bucket: string) {
    try {
      const s3 = this.createS3Client(key, secret, region);
      const command = new GetObjectCommand({ Bucket: bucket, Key: filename });
      const response = await s3.send(command);
      return { stream: response.Body as Readable, contentType: response.ContentType };
    } catch (error) {
      throw new HttpException('Fichier introuvable', HttpStatus.NOT_FOUND);
    }
  }

  async deleteFile(filename: string, key: string, secret: string, region: string, bucket: string) {
    try {
      const s3 = this.createS3Client(key, secret, region);
      const command = new DeleteObjectCommand({ Bucket: bucket, Key: filename });
      await s3.send(command);
      return { message: 'Deleted' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
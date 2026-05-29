import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Param, 
  Res, 
  UseInterceptors, 
  UploadedFile, 
  Headers, 
  Query, 
  ParseFilePipe, 
  MaxFileSizeValidator 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { Response } from 'express';

@Controller('api/files')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  // 1. LISTER LES FICHIERS
  @Get()
  async getFiles(
    @Headers('x-aws-key') key: string,
    @Headers('x-aws-secret') secret: string,
    @Headers('x-aws-region') region: string,
    @Headers('x-aws-bucket') bucket: string,
  ) {
    return this.s3Service.listFiles(key, secret, region, bucket);
  }

  // 2. UPLOADER UN FICHIER (AVEC VALIDATION DE TAILLE)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      // 🎯 SÉCURITÉ PROF : Validation stricte de la taille (Max 10 Mo)
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ 
            maxSize: 10 * 1024 * 1024, 
            message: 'Le fichier est trop volumineux (limite : 10 Mo).' 
          }),
        ],
      }),
    ) file: Express.Multer.File,
    @Headers('x-aws-key') key: string,
    @Headers('x-aws-secret') secret: string,
    @Headers('x-aws-region') region: string,
    @Headers('x-aws-bucket') bucket: string,
  ) {
    return this.s3Service.uploadFile(file, key, secret, region, bucket);
  }

  // 3. TÉLÉCHARGER UN FICHIER
  @Get('download/:filename')
  async download(
    @Param('filename') filename: string, 
    @Res() res: Response,
    @Query('key') key: string,
    @Query('secret') secret: string,
    @Query('region') region: string,
    @Query('bucket') bucket: string,
  ) {
    const { stream, contentType } = await this.s3Service.downloadFile(filename, key, secret, region, bucket);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    stream.pipe(res);
  }

  // 4. SUPPRIMER UN FICHIER
  @Delete(':filename')
  async delete(
    @Param('filename') filename: string,
    @Headers('x-aws-key') key: string,
    @Headers('x-aws-secret') secret: string,
    @Headers('x-aws-region') region: string,
    @Headers('x-aws-bucket') bucket: string,
  ) {
    return this.s3Service.deleteFile(filename, key, secret, region, bucket);
  }
}
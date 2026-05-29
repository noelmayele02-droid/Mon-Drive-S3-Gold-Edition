import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activation du CORS pour autoriser l'application Vue.js à communiquer avec l'API
  app.enableCors({
    origin: '*', // Permet à ton index.html local de se connecter
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, x-aws-key, x-aws-secret, x-aws-region, x-aws-bucket',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Le serveur API est en ligne sur : http://localhost:${port}`);
}
bootstrap();
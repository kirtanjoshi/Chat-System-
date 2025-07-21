/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors();
//   await app.listen(process.env.PORT ?? 3002);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific options
  app.enableCors({
    origin: '*', // Allow all origins for testing;
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

 const config = new DocumentBuilder()
   .setTitle('Chat System API')
   .setDescription('The chat system API description')
   .setVersion('1.0')
   .addTag('chtsystem')
   .build();
 const documentFactory = () => SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api', app, documentFactory);


  // Get port from environment or default to 3002
  const port = process.env.PORT || 3002;

  // Listen on all network interfaces
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}`);
}
bootstrap();
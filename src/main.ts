/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // For using upload package in cloudinary

  await app.register(fastifyMultipart);


  // Enable CORS with Fastify plugin
  await app.register(fastifyCors, {
    origin: '*', // Allow all origins for development/testing
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  const fastify = app.getHttpAdapter().getInstance();
  console.log(fastify.printRoutes());


  await app.listen(3002, '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Application is running on: ${ 3002}`); // Log the port for debugging
}
bootstrap();

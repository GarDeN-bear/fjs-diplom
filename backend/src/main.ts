import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';

import {AppModule} from './app.module';

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5000',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET,PUT,POST,DELETE'],
    allowedHeaders: ['Content-Type, Accept, Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
      new ValidationPipe({
        transform: true,  // ВКЛЮЧИТЬ трансформацию
        transformOptions: {
          enableImplicitConversion: false,  // Разрешить неявное преобразование
        },
      }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

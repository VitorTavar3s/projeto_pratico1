import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    '/webhooks/stripe',
    express.raw({type: 'application/json'})
  )
  await app.listen(process.env.PORT ?? 3000);

}

bootstrap();

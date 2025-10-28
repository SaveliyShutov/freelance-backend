import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({ 
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL, process.env.SITE_URL, process.env.BOT_URL],
    credentials: true
  })
  app.useGlobalFilters(new HttpExceptionFilter())

  app.use(cookieParser())

  await app.listen(process.env.PORT)
}
bootstrap()

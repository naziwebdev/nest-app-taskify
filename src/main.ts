import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api/v1');
  app.use(
    cookieSession({
      name: 'session',
      keys: [process.env.SESSION_KEY],
      maxAge: 24 * 60 * 60 * 1000,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

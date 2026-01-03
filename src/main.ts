import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from '@/app.module';
import { env } from '@/common/config/env.config';
import { CorsConfig } from '@/common/config/cors.config';
import { SwaggerConfig } from '@/common/config/swagger.config';
import { ValidationConfig } from '@/common/config/validation.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  CorsConfig.setup(app);
  ValidationConfig.setup(app);
  SwaggerConfig.setup(app);

  const port = env.PORT;
  await app.listen(port);
  Logger.log(`Server is running on port ${port}`, 'Bootstrap');
}

void bootstrap();

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { validateEnv } from '@/common/config/env.config';
import { AppConfig } from '@/common/config/app.config';
import { CorsConfig } from '@/common/config/cors.config';
import { SwaggerConfig } from '@/common/config/swagger.config';
import { ValidationConfig } from '@/common/config/validation.config';

async function bootstrap(): Promise<void> {
  validateEnv();

  const app = await NestFactory.create(AppModule);

  CorsConfig.setup(app);
  ValidationConfig.setup(app);
  SwaggerConfig.setup(app);

  const port = AppConfig.getPort();
  await app.listen(port);
  Logger.log(`Server is running on port ${port}`, 'Bootstrap');
}

void bootstrap();

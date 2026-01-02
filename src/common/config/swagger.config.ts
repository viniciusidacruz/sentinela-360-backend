import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from '@/common/config/app.config';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';

export class SwaggerConfig {
  static setup(app: INestApplication): void {
    if (AppConfig.isProduction()) {
      return;
    }

    const config = new DocumentBuilder()
      .setTitle(SWAGGER_CONSTANTS.TITLE)
      .setDescription(SWAGGER_CONSTANTS.DESCRIPTION)
      .setVersion(SWAGGER_CONSTANTS.VERSION)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        SWAGGER_CONSTANTS.BEARER_AUTH_NAME,
      )
      .addTag(
        SWAGGER_CONSTANTS.TAGS.AUTH.name,
        SWAGGER_CONSTANTS.TAGS.AUTH.description,
      )
      .addTag(
        SWAGGER_CONSTANTS.TAGS.COMPANIES.name,
        SWAGGER_CONSTANTS.TAGS.COMPANIES.description,
      )
      .addTag(
        SWAGGER_CONSTANTS.TAGS.CONSUMERS.name,
        SWAGGER_CONSTANTS.TAGS.CONSUMERS.description,
      )
      .addTag(
        SWAGGER_CONSTANTS.TAGS.FEEDBACKS.name,
        SWAGGER_CONSTANTS.TAGS.FEEDBACKS.description,
      )
      .addTag(
        SWAGGER_CONSTANTS.TAGS.REPUTATION.name,
        SWAGGER_CONSTANTS.TAGS.REPUTATION.description,
      )
      .addTag(
        SWAGGER_CONSTANTS.TAGS.SUBSCRIPTIONS.name,
        SWAGGER_CONSTANTS.TAGS.SUBSCRIPTIONS.description,
      )
      .addTag(
        SWAGGER_CONSTANTS.TAGS.BILLING.name,
        SWAGGER_CONSTANTS.TAGS.BILLING.description,
      )
      .addTag(
        SWAGGER_CONSTANTS.TAGS.TEAM.name,
        SWAGGER_CONSTANTS.TAGS.TEAM.description,
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(SWAGGER_CONSTANTS.PATH, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    const port = AppConfig.getPort();
    Logger.log(
      `Swagger documentation available at http://localhost:${port}/${SWAGGER_CONSTANTS.PATH}`,
      'Bootstrap',
    );
  }
}

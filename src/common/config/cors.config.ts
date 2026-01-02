import { INestApplication } from '@nestjs/common';

import { env } from '@/common/config/env.config';
import { APP_CONSTANTS } from '@/common/constants/app.constants';

export class CorsConfig {
  static setup(app: INestApplication): void {
    const allowedOrigins = env.CORS_ORIGINS;

    app.enableCors({
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
      ) => {
        if (!origin) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: [...APP_CONSTANTS.CORS.ALLOWED_METHODS],
      allowedHeaders: [...APP_CONSTANTS.CORS.ALLOWED_HEADERS],
      credentials: true,
      maxAge: APP_CONSTANTS.CORS.MAX_AGE_SECONDS,
    });
  }
}

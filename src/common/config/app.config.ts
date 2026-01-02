import { env } from './env.config';

export class AppConfig {
  static getPort(): number {
    return env.PORT;
  }

  static getNodeEnv(): string {
    return env.NODE_ENV;
  }

  static isDevelopment(): boolean {
    return this.getNodeEnv() === 'development';
  }

  static isProduction(): boolean {
    return this.getNodeEnv() === 'production';
  }

  static isTest(): boolean {
    return this.getNodeEnv() === 'test';
  }

  static getCorsOrigins(): string[] {
    return env.CORS_ORIGINS;
  }

  static getDatabaseUrl(): string | undefined {
    return env.DATABASE_URL;
  }

  static getJwtSecret(): string | undefined {
    return env.JWT_SECRET;
  }

  static getJwtExpiresIn(): string {
    return env.JWT_EXPIRES_IN;
  }

  static getWebhookSecret(): string | undefined {
    return env.WEBHOOK_SECRET;
  }
}

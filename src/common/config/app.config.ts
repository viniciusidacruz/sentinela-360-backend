import { validateEnv } from './env.config';

let env: ReturnType<typeof validateEnv>;

function getEnv() {
  if (!env) {
    env = validateEnv();
  }
  return env;
}

export class AppConfig {
  static getPort(): number {
    return getEnv().PORT;
  }

  static getNodeEnv(): string {
    return getEnv().NODE_ENV;
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
    return getEnv().CORS_ORIGINS;
  }

  static getDatabaseUrl(): string | undefined {
    return getEnv().DATABASE_URL;
  }

  static getJwtSecret(): string | undefined {
    return getEnv().JWT_SECRET;
  }

  static getJwtExpiresIn(): string {
    return getEnv().JWT_EXPIRES_IN;
  }

  static getWebhookSecret(): string | undefined {
    return getEnv().WEBHOOK_SECRET;
  }
}

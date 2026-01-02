import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3333),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((val) => val.split(',').map((origin) => origin.trim())),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(1).optional(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  WEBHOOK_SECRET: z.string().min(1).optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

let envConfig: EnvConfig;

export function validateEnv(): EnvConfig {
  if (envConfig) {
    return envConfig;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errorMessage = `Invalid environment variables: ${JSON.stringify(parsed.error.format(), null, 2)}`;
    throw new Error(errorMessage);
  }

  envConfig = parsed.data;
  return envConfig;
}

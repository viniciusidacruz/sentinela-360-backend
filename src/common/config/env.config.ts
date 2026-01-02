import 'dotenv/config';
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

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(_env.error.format(), null, 2)}`,
  );
}

export type EnvConfig = z.infer<typeof envSchema>;

export const env: EnvConfig = _env.data;

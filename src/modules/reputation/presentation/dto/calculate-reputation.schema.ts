import { z } from 'zod';

export const calculateReputationSchema = z.object({
  saveHistory: z.boolean().optional().default(false),
});

export type CalculateReputationInput = z.infer<
  typeof calculateReputationSchema
>;

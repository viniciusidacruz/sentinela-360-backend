import { z } from 'zod';

export const createFeedbackSchema = z.object({
  companyId: z.string().uuid({ message: 'Company ID must be a valid UUID' }),
  rating: z
    .number()
    .int({ message: 'Rating must be an integer' })
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating must be at most 5' }),
  comment: z.string().optional(),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;

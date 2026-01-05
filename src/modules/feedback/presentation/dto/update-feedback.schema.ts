import { z } from 'zod';

export const updateFeedbackSchema = z.object({
  rating: z
    .number()
    .int({ message: 'Rating must be an integer' })
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating must be at most 5' })
    .optional(),
  comment: z.string().nullable().optional(),
});

export type UpdateFeedbackInput = z.infer<typeof updateFeedbackSchema>;

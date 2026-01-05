import { z } from 'zod';

export const updateCompanySchema = z.object({
  name: z
    .string({ message: 'Nome da empresa é obrigatório' })
    .min(2, { message: 'Nome da empresa deve ter no mínimo 2 caracteres' })
    .optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).optional(),
});

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;

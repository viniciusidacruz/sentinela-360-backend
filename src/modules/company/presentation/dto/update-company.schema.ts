import { z } from 'zod';
import { CompanyCategory } from '../../domain/entities/company.entity';

export const updateCompanySchema = z.object({
  name: z
    .string({ message: 'Nome da empresa deve ser uma string' })
    .min(2, { message: 'Nome da empresa deve ter no mínimo 2 caracteres' })
    .optional(),
  category: z
    .nativeEnum(CompanyCategory, {
      message: 'Categoria da empresa inválida',
    })
    .optional(),
});

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;

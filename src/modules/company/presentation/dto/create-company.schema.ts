import { z } from 'zod';

export const createCompanySchema = z.object({
  cnpj: z.string({ message: 'CNPJ é obrigatório' }).regex(/^\d{14}$/, {
    message: 'CNPJ deve conter exatamente 14 dígitos numéricos',
  }),
  name: z
    .string({ message: 'Nome da empresa é obrigatório' })
    .min(2, { message: 'Nome da empresa deve ter no mínimo 2 caracteres' }),
  category: z.enum(
    [
      'FOOD_AND_BEVERAGE',
      'RETAIL',
      'SERVICES',
      'HEALTH',
      'EDUCATION',
      'TECHNOLOGY',
      'CONSTRUCTION',
      'TRANSPORT',
      'TOURISM_AND_HOSPITALITY',
      'BEAUTY_AND_AESTHETICS',
      'AUTOMOTIVE',
      'REAL_ESTATE',
      'FINANCIAL',
      'ENTERTAINMENT',
      'FASHION_AND_APPAREL',
      'SPORTS_AND_FITNESS',
      'PET_SERVICES',
      'LEGAL',
      'CONSULTING',
      'MANUFACTURING',
      'AGRICULTURE',
      'ENERGY',
      'TELECOMMUNICATIONS',
      'MEDIA_AND_ADVERTISING',
      'NON_PROFIT',
      'OTHER',
    ],
    {
      message: 'Categoria da empresa é obrigatória',
    },
  ),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

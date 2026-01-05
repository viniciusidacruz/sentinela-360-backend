import { z } from 'zod';

const baseUserSchema = z.object({
  email: z
    .string({ message: 'Email é obrigatório' })
    .email({ message: 'Email deve ser um endereço de email válido' }),
  password: z
    .string({ message: 'Senha é obrigatória' })
    .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
  name: z.string().optional(),
});

const registerConsumerSchema = baseUserSchema.extend({
  userType: z.literal('consumer'),
});

const registerCompanySchema = baseUserSchema.extend({
  userType: z.literal('company'),
  cnpj: z
    .string({ message: 'CNPJ é obrigatório para empresas' })
    .regex(/^\d{14}$/, {
      message: 'CNPJ deve conter exatamente 14 dígitos numéricos',
    }),
  companyName: z
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

export const registerUserSchema = z.discriminatedUnion('userType', [
  registerConsumerSchema,
  registerCompanySchema,
]);

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

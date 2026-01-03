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
});

export const registerUserSchema = z.discriminatedUnion('userType', [
  registerConsumerSchema,
  registerCompanySchema,
]);

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

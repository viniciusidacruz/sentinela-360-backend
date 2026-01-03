import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z
    .string({ message: 'Email é obrigatório' })
    .email({ message: 'Email deve ser um endereço de email válido' }),
  password: z.string({ message: 'Senha é obrigatória' }).min(1),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;

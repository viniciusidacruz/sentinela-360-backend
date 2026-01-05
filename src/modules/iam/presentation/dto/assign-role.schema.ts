import { z } from 'zod';

export const assignRoleSchema = z.object({
  userId: z.string().uuid({ message: 'User ID inválido' }),
  roleId: z.string().uuid({ message: 'Role ID inválido' }),
});

export type AssignRoleInput = z.infer<typeof assignRoleSchema>;

import { z } from 'zod';

export const checkPermissionSchema = z.object({
  resource: z.string().min(1, { message: 'Resource é obrigatório' }),
  action: z.string().min(1, { message: 'Action é obrigatório' }),
  companyId: z.string().uuid().optional(),
});

export type CheckPermissionInput = z.infer<typeof checkPermissionSchema>;

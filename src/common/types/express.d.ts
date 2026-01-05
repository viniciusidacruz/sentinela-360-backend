import { UserRole } from '@/modules/auth/domain/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email: string;
        roles: UserRole[];
      };
    }
  }
}

export {};

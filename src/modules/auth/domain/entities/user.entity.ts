import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export enum UserRole {
  CONSUMER = 'CONSUMER',
  COMPANY_OWNER = 'COMPANY_OWNER',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly passwordHash: Password,
    public readonly name: string | null,
    public readonly roles: UserRole[],
    public readonly status: UserStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  hasRole(role: UserRole): boolean {
    return this.roles.includes(role);
  }
}

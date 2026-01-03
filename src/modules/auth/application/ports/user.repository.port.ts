import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { User, UserRole, UserStatus } from '../../domain/entities/user.entity';

export interface CreateUserInput {
  email: Email;
  passwordHash: Password;
  name: string | null;
  roles: UserRole[];
  status: UserStatus;
}

export interface UserRepositoryPort {
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: CreateUserInput): Promise<User>;
  updateRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void>;
  update(user: User): Promise<User>;
}

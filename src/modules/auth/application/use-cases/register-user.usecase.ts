import {
  Injectable,
  ConflictException,
  Inject,
} from '@nestjs/common';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import * as auditPort from '../ports/audit.port';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { UserRole, UserStatus } from '../../domain/entities/user.entity';

export interface RegisterUserInput {
  email: string;
  password: string;
  name?: string;
  userType?: 'consumer' | 'company';
}

export interface RegisterUserOutput {
  user: {
    id: string;
    email: string;
    name: string | null;
    roles: string[];
    createdAt: Date;
  };
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    @Inject('AuditPort')
    private readonly auditPort: auditPort.AuditPort,
  ) {}

  async execute(
    input: RegisterUserInput,
    ip?: string,
    userAgent?: string,
  ): Promise<RegisterUserOutput> {
    try {
      const email = Email.create(input.email);
      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        await this.auditPort.log({
          type: auditPort.AuditEventType.AUTH_REGISTER,
          ip,
          userAgent,
          success: false,
          error: 'Email already exists',
        });
        throw new ConflictException('Email already registered');
      }

      const password = await Password.create(input.password);
      const roles: UserRole[] =
        input.userType === 'company'
          ? [UserRole.COMPANY_OWNER]
          : [UserRole.CONSUMER];

      const user = await this.userRepository.create({
        email,
        passwordHash: password,
        name: input.name || null,
        roles,
        status: UserStatus.ACTIVE,
      });

      await this.auditPort.log({
        type: auditPort.AuditEventType.AUTH_REGISTER,
        userId: user.id,
        ip,
        userAgent,
        success: true,
      });

      return {
        user: {
          id: user.id,
          email: user.email.getValue(),
          name: user.name,
          roles: user.roles,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      await this.auditPort.log({
        type: auditPort.AuditEventType.AUTH_REGISTER,
        ip,
        userAgent,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}


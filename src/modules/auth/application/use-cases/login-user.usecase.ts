import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import * as auditPort from '../ports/audit.port';
import { Email } from '../../domain/value-objects/email.vo';

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  user: {
    id: string;
    email: string;
    name: string | null;
    roles: string[];
    createdAt: Date;
  };
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    @Inject('AuditPort')
    private readonly auditPort: auditPort.AuditPort,
  ) {}

  async execute(
    input: LoginUserInput,
    ip?: string,
    userAgent?: string,
  ): Promise<LoginUserOutput> {
    try {
      const email = Email.create(input.email);
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        await this.auditPort.log({
          type: auditPort.AuditEventType.AUTH_LOGIN,
          ip,
          userAgent,
          success: false,
          error: 'Invalid credentials',
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive()) {
        await this.auditPort.log({
          type: auditPort.AuditEventType.AUTH_LOGIN,
          userId: user.id,
          ip,
          userAgent,
          success: false,
          error: 'User is disabled',
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      const isValidPassword = await user.passwordHash.compare(input.password);
      if (!isValidPassword) {
        await this.auditPort.log({
          type: auditPort.AuditEventType.AUTH_LOGIN,
          userId: user.id,
          ip,
          userAgent,
          success: false,
          error: 'Invalid credentials',
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      await this.auditPort.log({
        type: auditPort.AuditEventType.AUTH_LOGIN,
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
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      await this.auditPort.log({
        type: auditPort.AuditEventType.AUTH_LOGIN,
        ip,
        userAgent,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}

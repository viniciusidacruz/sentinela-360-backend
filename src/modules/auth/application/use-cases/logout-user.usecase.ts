import { Injectable, Inject } from '@nestjs/common';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import * as auditPort from '../ports/audit.port';

@Injectable()
export class LogoutUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    @Inject('AuditPort')
    private readonly auditPort: auditPort.AuditPort,
  ) {}

  async execute(
    userId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.userRepository.updateRefreshTokenHash(userId, null);

    await this.auditPort.log({
      type: auditPort.AuditEventType.AUTH_LOGOUT,
      userId,
      ip,
      userAgent,
      success: true,
    });
  }
}


import {
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import type { TokenServicePort } from '../ports/token.service.port';
import * as auditPort from '../ports/audit.port';
import { GenerateTokensUseCase } from './generate-tokens.usecase';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    @Inject('TokenServicePort')
    private readonly tokenService: TokenServicePort,
    @Inject('AuditPort')
    private readonly auditPort: auditPort.AuditPort,
    private readonly generateTokensUseCase: GenerateTokensUseCase,
  ) {}

  async execute(
    refreshToken: string,
    ip?: string,
    userAgent?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(payload.sub);

      if (!user || !user.isActive()) {
        await this.auditPort.log({
          type: auditPort.AuditEventType.AUTH_REFRESH,
          userId: payload.sub,
          ip,
          userAgent,
          success: false,
          error: 'User not found or inactive',
        });
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newTokens = await this.generateTokensUseCase.execute(user);

      await this.auditPort.log({
        type: auditPort.AuditEventType.AUTH_REFRESH,
        userId: user.id,
        ip,
        userAgent,
        success: true,
      });

      return newTokens;
    } catch (error) {
      await this.auditPort.log({
        type: auditPort.AuditEventType.AUTH_REFRESH,
        ip,
        userAgent,
        success: false,
        error:
          error instanceof Error ? error.message : 'Invalid refresh token',
      });
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}


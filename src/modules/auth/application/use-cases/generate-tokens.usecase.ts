import { Injectable, Inject } from '@nestjs/common';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import type { TokenServicePort } from '../ports/token.service.port';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GenerateTokensUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    @Inject('TokenServicePort')
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = {
      sub: user.id,
      email: user.email.getValue(),
      roles: user.roles,
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.updateRefreshTokenHash(
      user.id,
      refreshTokenHash,
    );

    return { accessToken, refreshToken };
  }
}

